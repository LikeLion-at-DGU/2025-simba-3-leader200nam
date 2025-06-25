from django.shortcuts import render, get_object_or_404
from django.contrib.auth.decorators import login_required
from django.http import JsonResponse
from .models import Feed, Comment, Like, Report
from friends.models import Friend
from quest.models import Quest
from django.views.decorators.http import require_GET
from django.db.models import Q


def get_display_name(user):
    """사용자의 표시 이름을 반환하는 유틸리티 함수"""
    return user.nickname if user.nickname else user.username

def add_user_exp_and_check_levelup(user, exp_gain):
    """사용자 경험치 추가 및 레벨업 확인"""
    if hasattr(user, 'exp'):
        old_level = (user.exp // 1000) + 1
        user.exp += exp_gain
        user.save()
        new_level = (user.exp // 1000) + 1
        
        if new_level > old_level:
            return True, new_level
    return False, None

def create_feed_with_quest(user, quest, **kwargs):
    """퀘스트와 연관된 피드 생성"""
    return Feed.objects.create(
        author=user,
        quest=quest,
        is_completed=True,
        **kwargs
    )

def api_response(data=None, message="Success", status="success", error=None, status_code=200):
    """통일된 API 응답 형식"""
    response = {'status': status}
    if message:
        response['message'] = message
    if data is not None:
        response['data'] = data
    if error:
        response['error'] = error
    return JsonResponse(response, status=status_code)

@login_required
def feed_list(request):
    print(f"=== feed_list 디버깅 ===")
    print(f"현재 사용자: {request.user.username} (ID: {request.user.id})")
    
    # 친구 관계가 있는지 확인
    friends = Friend.objects.filter(user=request.user).select_related('friend')
    print(f"친구 관계 수: {friends.count()}")
    
    if friends.exists():
        # 친구 관계가 있으면: 친구들의 공개 피드 + 본인 피드
        friend_ids = [friend.friend.id for friend in friends]
        friend_ids.append(request.user.id)
        print(f"친구 ID 목록: {friend_ids}")
        
        feeds = Feed.objects.filter(
            Q(author=request.user) |  # 본인 피드는 모두 (공개/비공개)
            Q(author_id__in=friend_ids, is_private=False),  # 친구 피드는 공개만
            is_deleted=False
        ).select_related('author').order_by('-created_at')
    else:
        # 친구 관계가 없으면: 모든 사용자의 공개 피드 + 본인 피드
        print("친구 관계 없음 - 모든 공개 피드 + 본인 피드 가져오기")
        feeds = Feed.objects.filter(
            Q(author=request.user) |  # 본인 피드는 모두 (공개/비공개)
            Q(is_private=False),     # 다른 사용자 피드는 공개만
            is_deleted=False
        ).select_related('author').order_by('-created_at')
    
    print(f"가져온 피드 수: {feeds.count()}")
    for feed in feeds:
        print(f"피드 ID: {feed.id}, 작성자: {feed.author.username}, 공개여부: {not feed.is_private}, 삭제여부: {feed.is_deleted}")
        feed.is_liked = feed.likes.filter(user=request.user).exists()
        feed.is_public = not feed.is_private

    context = {
        'feeds': feeds
    }
    return render(request, 'feed/feedpage.html', context)

@login_required
# 로그인한 사용자만 접근 가능한 내 피드 목록 뷰 함수
def my_feed_list(request):
    feeds = Feed.objects.filter(
        author=request.user,
        is_deleted=False
    ).order_by('-created_at')
    
    return JsonResponse({
        'feeds': [{
            'id': feed.id,
            'content': feed.content,
            'created_at': feed.created_at.isoformat(),
            'likes_count': feed.likes.count(),
            'comments_count': feed.comments.count(),
            'is_private': feed.is_private
        } for feed in feeds]
    })

@login_required
# 로그인한 사용자만 접근 가능한 피드 생성 뷰 함수
def feed_create(request):
    if request.method == 'POST':
        quest_id = request.POST.get('quest_id')
        image = request.FILES.get('image')
        image_name = request.POST.get('image_name')
        location = request.POST.get('location')
        memo = request.POST.get('memo', '')
        is_private = request.POST.get('is_private', 'false').lower() == 'true'

        if not (quest_id and image and image_name and location):
            return api_response(error='필수 항목이 누락되었습니다.', status="error", status_code=400)

        quest = get_object_or_404(Quest, id=quest_id)

        feed = create_feed_with_quest(
            user=request.user,
            quest=quest,
            image=image,
            image_name=image_name,
            location=location,
            memo=memo,
            is_private=is_private
        )

        # 경험치 증가 및 레벨업 확인
        leveled_up, new_level = add_user_exp_and_check_levelup(request.user, quest.exp)
        if leveled_up:
            request.session['leveled_up'] = True
            request.session['new_level'] = new_level

        return JsonResponse({
            'id': feed.id,
            'quest': feed.quest.title,
            'image_url': feed.image.url,
            'image_name': feed.image_name,
            'location': feed.location,
            'memo': feed.memo,
            'is_private': feed.is_private,
            'created_at': feed.created_at.isoformat(),
            'exp_gained': quest.exp
        })
    return api_response(error='Invalid request method', status="error", status_code=400)

@login_required
#로그인한 사용자만 접근 가능한 피드 상세 정보 뷰 함수
def feed_detail(request, feed_id):
    feed = get_object_or_404(Feed, id=feed_id)
    
    # 비공개 피드는 작성자만 볼 수 있음
    if feed.is_private and feed.author != request.user:
        return api_response(error='Permission denied', status="error", status_code=403)
    
    comments = feed.comments.all().order_by('-created_at')
    
    return JsonResponse({
        'feed': {
            'id': feed.id,
            'author': feed.author.username,
            'content': feed.content,
            'created_at': feed.created_at.isoformat(),
            'likes_count': feed.likes.count(),
            'is_liked': feed.likes.filter(user=request.user).exists(),
            'is_private': feed.is_private,
            'comments': [{
                'id': comment.id,
                'nickname': get_display_name(comment.author),
                'author_image': comment.author.image.url if comment.author.image else None,
                'content': comment.content,
                'created_at': comment.created_at.isoformat()
            } for comment in comments]
        }
    })

@login_required
# 로그인한 사용자만 접근 가능한 피드 수정 뷰 함수
def feed_update(request, feed_id):
    feed = get_object_or_404(Feed, id=feed_id, author=request.user)
    
    if request.method == 'POST':
        content = request.POST.get('content')
        feed.content = content
        feed.save()
        
        return JsonResponse({
            'id': feed.id,
            'content': feed.content,
            'updated_at': feed.updated_at.isoformat()
        })
    return api_response(error='Invalid request method', status="error", status_code=400)

@login_required
# 로그인한 사용자만 접근 가능한 피드 삭제 뷰 함수
def feed_delete(request, feed_id):
    feed = get_object_or_404(Feed, id=feed_id, author=request.user)
    feed.is_deleted = True
    feed.save()
    return api_response(message="피드가 삭제되었습니다.")

@login_required
# 로그인한 사용자만 접근 가능한 피드 공개 여부 토글 뷰 함수
def toggle_public(request, feed_id):
    feed = get_object_or_404(Feed, id=feed_id, author=request.user)
    feed.is_private = not feed.is_private
    feed.save()
    return JsonResponse({
        'status': 'ok',
        'is_public': not feed.is_private
    })

@login_required
# 로그인한 사용자만 접근 가능한 피드 좋아요 뷰 함수
def feed_like(request, feed_id):
    feed = get_object_or_404(Feed, id=feed_id)
    like, created = Like.objects.get_or_create(feed=feed, user=request.user)
    
    if not created:
        like.delete()
        is_liked = False
    else:
        is_liked = True
    
    return JsonResponse({
        'status': 'ok',
        'is_liked': is_liked,
        'likes_count': feed.likes.count()
    })

@login_required
# 로그인한 사용자만 접근 가능한 피드 댓글 생성 뷰 함수
def comment_create(request, feed_id):
    if request.method == 'POST':
        feed = get_object_or_404(Feed, id=feed_id)
        content = request.POST.get('content')
        
        comment = Comment.objects.create(
            feed=feed,
            author=request.user,
            content=content
        )
        return JsonResponse({
            'id': comment.id,
            'nickname': get_display_name(request.user),
            'author_image': request.user.image.url if request.user.image else None,
            'content': comment.content,
            'created_at': comment.created_at.isoformat()
        })
    return api_response(error='Invalid request method', status="error", status_code=400)

@login_required
# 로그인한 사용자만 접근 가능한 피드 댓글 삭제 뷰 함수
def comment_delete(request, feed_id, comment_id):
    comment = get_object_or_404(Comment, id=comment_id, author=request.user)
    comment.delete()
    return api_response(message="댓글이 삭제되었습니다.")

@login_required
# 로그인한 사용자만 접근 가능한 피드 신고 뷰 함수
def feed_report(request, feed_id):
    if request.method == 'POST':
        feed = get_object_or_404(Feed, id=feed_id)
        reason = request.POST.get('reason')
        
        Report.objects.create(
            feed=feed,
            reporter=request.user,
            reason=reason
        )
        
        # 신고된 피드 숨기기
        feed.is_deleted = True
        feed.save()
        
        return api_response(message="신고가 접수되었습니다.")
    return api_response(error='Invalid request method', status="error", status_code=400)

@login_required
# 로그인한 사용자만 접근 가능한 퀘스트 인증 상태 확인 뷰 함수
def quest_auth_status(request):
    month = int(request.GET.get('month', 0))
    week = int(request.GET.get('week', 0))
    if not month or not week:
        return api_response(error='month, week 쿼리 파라미터가 필요합니다.', status="error", status_code=400)
    
    quests = Quest.objects.filter(month=month, week=week)
    completed_feeds = Feed.objects.filter(author=request.user, quest__in=quests, is_completed=True)
    completed_quest_ids = list(completed_feeds.values_list('quest_id', flat=True))
    completed_count = len(completed_quest_ids)
    is_all_completed = completed_count >= 3
    
    return JsonResponse({
        'is_all_completed': is_all_completed, 
        'completed_count': completed_count,
        'completed_quests': completed_quest_ids
    })

@login_required
def quest_auth_feed_create(request, quest_id):
    """퀘스트 인증을 위한 피드 생성"""
    if request.method == 'POST':
        quest = get_object_or_404(Quest, id=quest_id)
        image = request.FILES.get('image')
        image_name = request.POST.get('image_name', '')
        location = request.POST.get('location', '')
        memo = request.POST.get('memo', '')
        content = request.POST.get('content', '')
        
        if not image:
            return api_response(error='이미지는 필수입니다.', status="error", status_code=400)
        
        # 퀘스트 인증 피드 생성
        feed = create_feed_with_quest(
            user=request.user,
            quest=quest,
            image=image,
            image_name=image_name,
            location=location,
            memo=memo,
            content=content
        )
        
        # 경험치 증가 및 레벨업 확인
        leveled_up, new_level = add_user_exp_and_check_levelup(request.user, quest.exp)
        if leveled_up:
            request.session['leveled_up'] = True
            request.session['new_level'] = new_level
        
        return JsonResponse({
            'status': 'success',
            'message': '퀘스트 인증이 완료되었습니다!',
            'feed_id': feed.id,
            'exp_gained': quest.exp,
            'quest_title': quest.title
        })
    
    return api_response(error='POST 요청만 허용됩니다.', status="error", status_code=405)

@login_required
def quest_auth_page(request, quest_id):
    """퀘스트 인증 페이지 렌더링"""
    quest = get_object_or_404(Quest, id=quest_id)
    
    context = {
        'quest': quest
    }
    return render(request, 'feed/quest_auth.html', context)

@require_GET
@login_required
# 로그인한 사용자만 접근 가능한 월별 피드 목록 뷰 함수
def monthly_feeds(request):
    month = int(request.GET.get('month', 0))
    if not month:
        return api_response(error='month 쿼리 파라미터가 필요합니다.', status="error", status_code=400)
    feeds = Feed.objects.filter(author=request.user, created_at__month=month, is_deleted=False).order_by('-created_at')
    feed_list = [
        {
            'id': feed.id,
            'content': feed.content,
            'image_url': feed.image.url if feed.image else '',
            'likes_count': feed.likes.count(),
            'comments_count': feed.comments.count(),
            'created_at': feed.created_at.strftime('%Y-%m-%d'),
        }
        for feed in feeds
    ]
    return JsonResponse({'feeds': feed_list})


