from django.shortcuts import render, get_object_or_404, redirect
from django.contrib.auth.decorators import login_required
from django.http import JsonResponse
from django.db.models import Q
from .models import Feed, Comment, Like, Report
from friends.models import Friend
from quest.models import Quest

# Create your views here.
def feed(request):
    return render(request, 'feed/feedpage.html')

@login_required
def feed_list(request):
    # 친구 관계에 있는 사용자들의 피드만 가져오기
    # 이제 Friend 모델에 status 필드가 있으므로 필터링 가능
    friends = Friend.objects.filter(
        user=request.user,
        status='accepted'
    )
    friend_ids = [friend.friend.id for friend in friends]
    friend_ids.append(request.user.id)
    
    feeds = Feed.objects.filter(
        author_id__in=friend_ids,
        is_private=False
    ).order_by('-created_at')
    
    context = {
        'feeds': feeds
    }
    return render(request, 'feed/feedpage.html', context)

@login_required
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
def feed_create(request):
    if request.method == 'POST':
        quest_id = request.POST.get('quest_id')
        image = request.FILES.get('image')
        image_name = request.POST.get('image_name')
        location = request.POST.get('location')
        memo = request.POST.get('memo', '')
        is_private = request.POST.get('is_private', 'false').lower() == 'true'

        if not (quest_id and image and image_name and location):
            return JsonResponse({'error': '필수 항목이 누락되었습니다.'}, status=400)

        quest = get_object_or_404(Quest, id=quest_id)

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

        # 경험치 증가 (User 모델에 exp 필드가 있다고 가정)
        if hasattr(request.user, 'exp'):
            request.user.exp += quest.exp
            request.user.save()

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
    return JsonResponse({'error': 'Invalid request method'}, status=400)

@login_required
def feed_detail(request, feed_id):
    feed = get_object_or_404(Feed, id=feed_id)
    
    # 비공개 피드는 작성자만 볼 수 있음
    if feed.is_private and feed.author != request.user:
        return JsonResponse({'error': 'Permission denied'}, status=403)
    
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
                'author': comment.author.username,
                'content': comment.content,
                'created_at': comment.created_at.isoformat()
            } for comment in comments]
        }
    })

@login_required
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
    return JsonResponse({'error': 'Invalid request method'}, status=400)

@login_required
def feed_delete(request, feed_id):
    feed = get_object_or_404(Feed, id=feed_id, author=request.user)
    feed.is_deleted = True
    feed.save()
    return JsonResponse({'status': 'success'})

@login_required
def toggle_privacy(request, feed_id):
    feed = get_object_or_404(Feed, id=feed_id, author=request.user)
    feed.is_private = not feed.is_private
    feed.save()
    return JsonResponse({
        'is_private': feed.is_private
    })

@login_required
def feed_like(request, feed_id):
    feed = get_object_or_404(Feed, id=feed_id)
    like, created = Like.objects.get_or_create(feed=feed, user=request.user)
    
    if not created:
        like.delete()
        is_liked = False
    else:
        is_liked = True
    
    return JsonResponse({
        'is_liked': is_liked,
        'likes_count': feed.likes.count()
    })

@login_required
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
            'author': comment.author.username,
            'content': comment.content,
            'created_at': comment.created_at.isoformat()
        })
    return JsonResponse({'error': 'Invalid request method'}, status=400)

@login_required
def comment_delete(request, feed_id, comment_id):
    comment = get_object_or_404(Comment, id=comment_id, author=request.user)
    comment.delete()
    return JsonResponse({'status': 'success'})

@login_required
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
        
        return JsonResponse({'status': 'success'})
    return JsonResponse({'error': 'Invalid request method'}, status=400)

@login_required
def quest_auth_status(request):
    month = int(request.GET.get('month', 0))
    week = int(request.GET.get('week', 0))
    if not month or not week:
        return JsonResponse({'error': 'month, week 쿼리 파라미터가 필요합니다.'}, status=400)
    
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
            return JsonResponse({'error': '이미지는 필수입니다.'}, status=400)
        
        # 퀘스트 인증 피드 생성
        feed = Feed.objects.create(
            author=request.user,
            quest=quest,
            image=image,
            image_name=image_name,
            location=location,
            memo=memo,
            content=content,
            is_completed=True
        )
        
        # 사용자 경험치 증가 (User 모델에 exp 필드가 있다고 가정)
        if hasattr(request.user, 'exp'):
            request.user.exp += quest.exp
            request.user.save()
        
        return JsonResponse({
            'status': 'success',
            'message': '퀘스트 인증이 완료되었습니다!',
            'feed_id': feed.id,
            'exp_gained': quest.exp,
            'quest_title': quest.title
        })
    
    return JsonResponse({'error': 'POST 요청만 허용됩니다.'}, status=405)

@login_required
def quest_auth_page(request, quest_id):
    """퀘스트 인증 페이지 렌더링"""
    quest = get_object_or_404(Quest, id=quest_id)
    
    context = {
        'quest': quest
    }
    return render(request, 'feed/quest_auth.html', context)


