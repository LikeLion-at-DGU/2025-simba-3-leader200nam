from django.shortcuts import render, get_object_or_404
from django.http import JsonResponse
from django.contrib.auth.decorators import login_required
from .models import Quest
import random
from datetime import datetime

# Create your views here.

@login_required
def quest_list(request):
    """현재 월/주차의 랜덤 퀘스트 3개 제공"""
    # 현재 날짜 기준으로 월/주차 계산
    now = datetime.now()
    current_month = now.month
    current_week = (now.day - 1) // 7 + 1
    
    # 해당 월/주차의 모든 퀘스트 조회
    quests = Quest.objects.filter(month=current_month, week=current_week)
    
    # 3개 랜덤 선택 (3개보다 적으면 모두 반환)
    if quests.count() >= 3:
        random_quests = random.sample(list(quests), 3)
    else:
        random_quests = list(quests)
    
    quest_data = [
        {
            'id': quest.id,
            'title': quest.title,
            'description': quest.description,
            'exp': quest.exp,
            'month': quest.month,
            'week': quest.week
        } for quest in random_quests
    ]
    
    return JsonResponse({
        'quests': quest_data,
        'current_month': current_month,
        'current_week': current_week
    })

@login_required
def quest_detail(request, quest_id):
    """퀘스트 상세 정보 제공"""
    quest = get_object_or_404(Quest, id=quest_id)
    
    quest_data = {
        'id': quest.id,
        'title': quest.title,
        'description': quest.description,
        'exp': quest.exp,
        'month': quest.month,
        'week': quest.week
    }
    
    return JsonResponse({'quest': quest_data})

@login_required
def quest_page(request, quest_id):
    """퀘스트 인증 페이지 렌더링"""
    quest = get_object_or_404(Quest, id=quest_id)
    
    context = {
        'quest': quest
    }
    return render(request, 'quest/quest_auth.html', context)

@login_required
def get_current_quests(request):
    """메인 페이지용 현재 퀘스트 정보 제공"""
    now = datetime.now()
    current_month = now.month
    current_week = (now.day - 1) // 7 + 1
    
    quests = Quest.objects.filter(month=current_month, week=current_week)
    
    if quests.count() >= 3:
        random_quests = random.sample(list(quests), 3)
    else:
        random_quests = list(quests)
    
    quest_data = [
        {
            'id': quest.id,
            'title': quest.title,
            'description': quest.description,
            'exp': quest.exp
        } for quest in random_quests
    ]
    
    return JsonResponse({
        'quests': quest_data,
        'month': current_month,
        'week': current_week
    })
