from django.shortcuts import render, redirect
from django.contrib.auth.decorators import login_required
from django.contrib.auth.models import auth
from accounts.models import User
from django.contrib import messages
from django.http import JsonResponse
from quest.models import Quest
from feed.models import Feed
from datetime import datetime
from friends.models import Friend, FriendCode
import random
from typing import TYPE_CHECKING
from django.db.models import Count

if TYPE_CHECKING:
    from django.http import HttpRequest

# Create your views here.

@login_required
def mainpage(request):
    # 오늘 날짜가 12월 31일이면 endingpage로 이동
    now = datetime.now()
    if now.month == 12 and now.day == 31:
        return render(request, 'main/ending/endingpage.html')
    # 현재 날짜 기준으로 월/주차 계산
    current_month = now.month
    current_week = (now.day - 1) // 7 + 1
    
    # 해당 월/주차의 퀘스트 전체 조회
    quests = Quest.objects.filter(month=current_month, week=current_week)  # type: ignore
    current_quests = list(quests)
    
    # 사용자가 완료한 퀘스트 ID 목록
    completed_quest_ids = []
    if current_quests:
        completed_feeds = Feed.objects.filter(
            author=request.user, 
            quest__in=current_quests, 
            is_completed=True
        )
        completed_quest_ids = [feed.quest.id for feed in completed_feeds]
    
    # 사용자 정보
    level = request.user.level
    univ_name = request.user.univ_name
    if univ_name == "건국대학교":
        ako_image = f"koo{level if level <= 5 else 5}.svg"
    else:
        ako_image = f"ako{level if level <= 5 else 5}.svg"
    user_data = {
        'nickname': request.user.nickname or '서누',
        'univ_name': request.user.univ_name,
        'major_name': request.user.major_name,
        'bio': request.user.bio or '',
        'image_url': request.user.image.url if request.user.image else None,
        'exp': getattr(request.user, 'exp', 0),
        'level': request.user.level,
        'current_level_exp': request.user.current_level_exp,
        'max_level_exp': request.user.max_level_exp,
        'ako_image': ako_image
    }
    
    # 퀘스트 정보 (완료 상태 포함)
    quest_data = []
    for quest in current_quests:
        is_completed = quest.id in completed_quest_ids
        quest_data.append({
            'id': quest.id,
            'title': quest.title,
            'description': quest.description,
            'exp': quest.exp,
            'is_completed': is_completed
        })
    
    # 모든 퀘스트 완료 여부 체크
    is_all_completed = all(q['is_completed'] for q in quest_data) if quest_data else False

    # 주차별로 고유 플래그 키 생성
    quest_flag_key = f'all_quests_completed_flag_{current_month}_{current_week}'

    # 이번 주차 퀘스트를 처음 모두 완료한 경우에만 True 저장
    if is_all_completed and not request.session.get(quest_flag_key, False):
        request.session['all_quests_completed'] = True
        request.session[quest_flag_key] = True
    elif not is_all_completed:
        # 새로운 주차가 시작되면 플래그를 초기화
        request.session[quest_flag_key] = False

    context = {
        'user': user_data,
        'quests': quest_data,
        'current_month': current_month,
        'current_week': current_week,
        'leveled_up': request.session.pop('leveled_up', False),
        'new_level': request.session.pop('new_level', None),
        'all_quests_completed': request.session.pop('all_quests_completed', False),
    }
    
    return render(request, 'main/mainpage.html', context)

@login_required
def intropage(request):
    user_data = {
        'univ_name': request.user.univ_name,
        'nickname': request.user.nickname or '',
    }
    return render(request, 'intro/intropage.html', {'user': user_data})

def signin(request):
    return render(request, 'signin.html')

def signup(request):
    return render(request, 'signup.html')

@login_required
def introInputPage(request):
    print("introInputPage 진입, method:", request.method)
    print("현재 유저:", request.user, "is_authenticated:", request.user.is_authenticated)
    if request.method == 'POST':
        nickname = request.POST.get('name', '').strip()
        print("닉네임 입력값:", nickname)
        if 2 <= len(nickname) <= 6:
            request.user.nickname = nickname
            request.user.save()
            print("닉네임 저장 성공, 메인페이지로 리다이렉트")
            return redirect('mainpage')
        else:
            print("닉네임 유효성 실패")
            return render(request, 'intro/introInputPage.html')
    return render(request, 'intro/introInputPage.html')

def registeration(request):
    if request.method == 'POST':
        quest_id = request.POST.get('quest_id')
        image = request.FILES.get('image')
        image_name = request.POST.get('image_name')
        location = request.POST.get('location')
        memo = request.POST.get('memo', '')
        is_public = request.POST.get('is_public') == 'on'
        is_private = not is_public

        # quest_id 누락 시 등록 페이지로 리다이렉트
        if not (quest_id and image and image_name and location):
            messages.error(request, '필수 항목이 누락되었습니다.')
            return redirect('registeration')

        try:
            quest = Quest.objects.get(id=quest_id)
            existing_feed = Feed.objects.filter(author=request.user, quest=quest, is_completed=True).first()
            if existing_feed:
                messages.error(request, '이미 완료된 퀘스트입니다.')
                return redirect('mainpage')
            feed = Feed.objects.create(
                author=request.user,
                quest=quest,
                image=image,
                image_name=image_name,
                location=location,
                memo=memo,
                is_private=is_private,
                is_completed=True
            )
            if hasattr(request.user, 'exp'):
                old_level = request.user.level
                request.user.exp += quest.exp
                request.user.save()
                new_level = request.user.level
                if new_level > old_level:
                    request.session['leveled_up'] = True
                    request.session['new_level'] = new_level
            messages.success(request, f'퀘스트 인증이 완료되었습니다! (+{quest.exp} exp)')
            return redirect('mainpage')
        except Quest.DoesNotExist:
            messages.error(request, '존재하지 않는 퀘스트입니다.')
            return redirect('mainpage')
        except Exception as e:
            messages.error(request, f'퀘스트 인증 중 오류가 발생했습니다: {e}')
            return redirect('registeration')
    # GET 요청: 퀘스트 정보를 context에 포함
    quest_id = request.GET.get('quest_id')
    quest = None
    if quest_id:
        try:
            quest = Quest.objects.get(id=quest_id)
            existing_feed = Feed.objects.filter(author=request.user, quest=quest, is_completed=True).first()
            if existing_feed:
                messages.error(request, '이미 완료된 퀘스트입니다.')
                return redirect('mainpage')
        except Quest.DoesNotExist:
            messages.error(request, '존재하지 않는 퀘스트입니다.')
            return redirect('mainpage')
    context = {
        'quest': quest
    }
    return render(request, 'main/registeration.html', context)

@login_required
def profileModification(request):
    if request.method == 'POST':
        # 현재 사용자 정보 가져오기
        user = request.user
        
        # 폼 데이터에서 정보 추출
        nickname = request.POST.get('nickname', '').strip()
        major_name = request.POST.get('major_name', '').strip()
        bio = request.POST.get('bio', '').strip()
        
        # 유효성 검사
        if not nickname or len(nickname) < 2 or len(nickname) > 15:
            error = '닉네임은 2~15자 이내로 입력해주세요.'
            return render(request, 'main/profileModification.html', {'user': user, 'error': error})
        
        try:
            # 사용자 정보 업데이트
            user.nickname = nickname
            user.major_name = major_name
            user.bio = bio
            
            # 이미지 파일 처리
            if 'image' in request.FILES:
                user.image = request.FILES['image']
            
            user.save()
            return redirect('mainpage')
            
        except Exception as e:
            error = f'프로필 수정 중 오류가 발생했습니다: {e}'
            return render(request, 'main/profileModification.html', {'user': user, 'error': error})
    
    # GET 요청: 현재 사용자 정보를 폼에 표시
    return render(request, 'main/profileModification.html', {'user': request.user})



def rankPage(request):
    return render(request, 'main/rankPage.html')

def ending(request):
    # 사용자의 실제 데이터 계산
    user_exp = getattr(request.user, 'exp', 0)
    
    # 사용자가 작성한 게시물 수 (완료된 것만)
    total_posts = Feed.objects.filter(
        author=request.user, 
        is_completed=True,
        is_deleted=False
    ).count()
    
    # 사용자가 방문한 고유한 장소 수
    unique_locations = Feed.objects.filter(
        author=request.user, 
        is_completed=True,
        is_deleted=False,
        location__isnull=False
    ).exclude(location='').values('location').distinct().count()
    
    # 사용자 정보
    user_data = {
        'nickname': request.user.nickname or '서누',
        'univ_name': request.user.univ_name,
        'major_name': request.user.major_name,
        'bio': request.user.bio or '',
        'image_url': request.user.image.url if request.user.image else None,
        'exp': user_exp,
        'level': request.user.level,
        'current_level_exp': request.user.current_level_exp,
        'max_level_exp': request.user.max_level_exp,
        'ako_image': request.user.ako_image
    }
    
    context = {
        'user': user_data,
        'user_exp': user_exp,
        'total_posts': total_posts,
        'unique_locations': unique_locations,
    }
    
    return render(request, 'ending/endingpage.html', context)

def ending2(request):
    # 사용자 정보
    user_exp = getattr(request.user, 'exp', 0)
    user_data = {
        'nickname': request.user.nickname or '서누',
        'univ_name': request.user.univ_name,
        'major_name': request.user.major_name,
        'bio': request.user.bio or '',
        'image_url': request.user.image.url if request.user.image else None,
        'exp': user_exp,
        'level': request.user.level,
        'current_level_exp': request.user.current_level_exp,
        'max_level_exp': request.user.max_level_exp,
        'ako_image': request.user.ako_image
    }
    
    context = {
        'user': user_data
    }
    
    return render(request, 'ending2/ending2page.html', context)

# API 엔드포인트 - 사용자 정보 제공
@login_required
def get_user_info(request):
    """사용자 정보를 JSON으로 제공하는 API"""
    user_data = {
        'nickname': request.user.nickname or '서누',
        'univ_name': request.user.univ_name,
        'major_name': request.user.major_name,
        'bio': request.user.bio or '',
        'image_url': request.user.image.url if request.user.image else None,
        'exp': getattr(request.user, 'exp', 0),
        'level': request.user.level,
        'current_level_exp': request.user.current_level_exp,
        'max_level_exp': request.user.max_level_exp,
        'ako_image': request.user.ako_image
    }
    return JsonResponse(user_data)

# API 엔드포인트 - 닉네임 업데이트
@login_required
def update_nickname(request):
    """닉네임 업데이트 API"""
    if request.method == 'POST':
        nickname = request.POST.get('nickname')
        
        if nickname and len(nickname) >= 2 and len(nickname) <= 15:
            request.user.nickname = nickname
            request.user.save()
            return JsonResponse({
                'status': 'success',
                'message': '닉네임이 성공적으로 업데이트되었습니다.',
                'nickname': nickname
            })
        else:
            return JsonResponse({
                'status': 'error',
                'message': '닉네임은 2~15자 이내로 입력해주세요.'
            }, status=400)
    
    return JsonResponse({'status': 'error', 'message': 'POST 요청만 허용됩니다.'}, status=405)

def logout(request):
    auth.logout(request)
    return redirect('signin')

