from django.urls import path
from .views import (
    register,
    login_user,

    poll_list,
    create_poll,
    get_poll,
    update_poll,
    delete_poll,

    add_choice,
    poll_choices,
    update_choice,
    delete_choice,

    vote,
    has_voted,
    poll_results,
)

urlpatterns = [

    # ---------- AUTH ----------
    path('register/', register),
    path('login/', login_user),

    # ---------- POLLS ----------
    path('polls/', poll_list),                          # all users
    path('polls/create/', create_poll),                 # admin
    path('polls/<int:pk>/', get_poll),                  # admin
    path('polls/update/<int:pk>/', update_poll),        # admin
    path('polls/delete/<int:pk>/', delete_poll),        # admin

    # ---------- CHOICES ----------
    path('polls/add-choice/', add_choice),               # admin
    path('polls/<int:poll_id>/choices/', poll_choices), # admin
    path('choices/update/<int:pk>/', update_choice),    # admin
    path('choices/delete/<int:pk>/', delete_choice),    # admin

    # ---------- VOTING ----------
    path('polls/vote/', vote),                              # users
    path('polls/<int:poll_id>/has-voted/', has_voted),      # users
    path('polls/results/<int:poll_id>/', poll_results),     # users
]
