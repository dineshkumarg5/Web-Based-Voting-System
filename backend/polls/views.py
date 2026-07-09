from django.shortcuts import render
from django.contrib.auth.models import User
from django.contrib.auth import authenticate
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.views import TokenObtainPairView

from .models import Poll, Choice, Vote
from .serializers import CustomTokenObtainPairSerializer


# =========================
# AUTH
# =========================

class CustomLoginView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer


@api_view(['POST'])
def register(request):
    username = request.data.get('username')
    password = request.data.get('password')
    email = request.data.get('email')

    if not username or not password or not email:
        return Response(
            {"error": "Username, email, and password are required"},
            status=400
        )

    if User.objects.filter(username=username).exists():
        return Response({"error": "Username already exists"}, status=400)

    if User.objects.filter(email=email).exists():
        return Response({"error": "Email already registered"}, status=400)

    User.objects.create_user(
        username=username,
        email=email,
        password=password
    )

    return Response(
        {"message": "User registered successfully"},
        status=status.HTTP_201_CREATED
    )


@api_view(['POST'])
def login_user(request):
    username_or_email = request.data.get('username')
    password = request.data.get('password')

    if not username_or_email or not password:
        return Response(
            {"error": "Username/email and password required"},
            status=400
        )

    if '@' in username_or_email:
        try:
            user = User.objects.get(email=username_or_email)
            username = user.username
        except User.DoesNotExist:
            return Response({"error": "Invalid credentials"}, status=401)
    else:
        username = username_or_email

    user = authenticate(username=username, password=password)

    if not user:
        return Response({"error": "Invalid credentials"}, status=401)

    refresh = RefreshToken.for_user(user)

    return Response({
        "refresh": str(refresh),
        "access": str(refresh.access_token),
        "is_admin": user.is_staff
    })


# =========================
# POLLS
# =========================

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def poll_list(request):
    polls = Poll.objects.all()
    data = [
        {
            "id": p.id,
            "question": p.question,
            "choices_count": p.choices.count(),
        }
        for p in polls
    ]
    return Response(data)


@api_view(['POST'])
@permission_classes([IsAuthenticated, IsAdminUser])
def create_poll(request):
    question = request.data.get('question')

    if not question:
        return Response({"error": "Question is required"}, status=400)

    poll = Poll.objects.create(
        question=question,
        created_by=request.user
    )

    return Response(
        {"message": "Poll created", "poll_id": poll.id},
        status=201
    )


@api_view(['GET'])
@permission_classes([IsAuthenticated, IsAdminUser])
def get_poll(request, pk):
    try:
        poll = Poll.objects.get(id=pk)
        return Response({"id": poll.id, "question": poll.question})
    except Poll.DoesNotExist:
        return Response({"error": "Poll not found"}, status=404)


@api_view(['PUT'])
@permission_classes([IsAuthenticated, IsAdminUser])
def update_poll(request, pk):
    try:
        poll = Poll.objects.get(id=pk)
    except Poll.DoesNotExist:
        return Response({"error": "Poll not found"}, status=404)

    question = request.data.get("question")
    if not question:
        return Response({"error": "Question required"}, status=400)

    poll.question = question
    poll.save()

    return Response({"message": "Poll updated"})


@api_view(['DELETE'])
@permission_classes([IsAuthenticated, IsAdminUser])
def delete_poll(request, pk):
    try:
        poll = Poll.objects.get(id=pk)
        poll.delete()
        return Response({"message": "Poll deleted"})
    except Poll.DoesNotExist:
        return Response({"error": "Poll not found"}, status=404)


# =========================
# CHOICES (ADMIN)
# =========================

@api_view(['POST'])
@permission_classes([IsAuthenticated, IsAdminUser])
def add_choice(request):
    poll_id = request.data.get('poll_id')
    text = request.data.get('text')

    if not poll_id or not text:
        return Response(
            {"error": "poll_id and text are required"},
            status=400
        )

    try:
        poll = Poll.objects.get(id=poll_id)
    except Poll.DoesNotExist:
        return Response({"error": "Poll not found"}, status=404)

    choice = Choice.objects.create(poll=poll, text=text)

    return Response(
        {"message": "Choice added", "choice_id": choice.id},
        status=201
    )


@api_view(['GET'])
@permission_classes([IsAuthenticated, IsAdminUser])
def poll_choices(request, poll_id):
    try:
        poll = Poll.objects.get(id=poll_id)
    except Poll.DoesNotExist:
        return Response({"error": "Poll not found"}, status=404)

    choices = poll.choices.all()
    return Response([
        {"id": c.id, "text": c.text} for c in choices
    ])


@api_view(['PUT'])
@permission_classes([IsAuthenticated, IsAdminUser])
def update_choice(request, pk):
    try:
        choice = Choice.objects.get(id=pk)
    except Choice.DoesNotExist:
        return Response({"error": "Choice not found"}, status=404)

    text = request.data.get("text")
    if not text:
        return Response({"error": "Text required"}, status=400)

    choice.text = text
    choice.save()

    return Response({"message": "Choice updated"})


@api_view(['DELETE'])
@permission_classes([IsAuthenticated, IsAdminUser])
def delete_choice(request, pk):
    try:
        choice = Choice.objects.get(id=pk)
        choice.delete()
        return Response({"message": "Choice deleted"})
    except Choice.DoesNotExist:
        return Response({"error": "Choice not found"}, status=404)


# =========================
# VOTING & RESULTS
# =========================

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def vote(request):
    poll_id = request.data.get('poll_id')
    choice_id = request.data.get('choice_id')

    if not poll_id or not choice_id:
        return Response(
            {"error": "poll_id and choice_id required"},
            status=400
        )

    try:
        poll = Poll.objects.get(id=poll_id)
        choice = Choice.objects.get(id=choice_id, poll=poll)
    except (Poll.DoesNotExist, Choice.DoesNotExist):
        return Response({"error": "Invalid poll or choice"}, status=404)

    if Vote.objects.filter(user=request.user, poll=poll).exists():
        return Response({"error": "Already voted"}, status=400)

    Vote.objects.create(
        user=request.user,
        poll=poll,
        choice=choice
    )

    return Response({"message": "Vote submitted"}, status=201)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def has_voted(request, poll_id):
    try:
        poll = Poll.objects.get(id=poll_id)
    except Poll.DoesNotExist:
        return Response({"error": "Poll not found"}, status=404)

    voted = Vote.objects.filter(user=request.user, poll=poll).exists()
    return Response({"voted": voted})


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def poll_results(request, poll_id):
    try:
        poll = Poll.objects.get(id=poll_id)
    except Poll.DoesNotExist:
        return Response({"error": "Poll not found"}, status=404)

    results = []
    for choice in poll.choices.all():
        results.append({
            "id": choice.id,
            "choice": choice.text,
            "votes": Vote.objects.filter(
                poll=poll, choice=choice
            ).count()
        })

    return Response({
        "poll": poll.question,
        "results": results
    })
