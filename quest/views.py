from django.shortcuts import render
from django.http import JsonResponse
from .models import Quest
import random

# Create your views here.

def quest_list(request):
    month = int(request.GET.get('month', 0))
    week = int(request.GET.get('week', 0))
    if not month or not week:
        return JsonResponse({'error': 'month, week 쿼리 파라미터가 필요합니다.'}, status=400)
    quests = list(Quest.objects.filter(month=month, week=week))
    random_quests = random.sample(quests, min(3, len(quests)))
    data = [
        {
            'id': q.id,
            'title': q.title,
            'description': q.description,
            'exp': q.exp,
        } for q in random_quests
    ]
    return JsonResponse({'quests': data})
