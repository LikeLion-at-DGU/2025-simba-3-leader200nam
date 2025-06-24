from django.shortcuts import render, redirect
from django.contrib.auth.decorators import login_required
from django.http import JsonResponse
from django.db.models import Q
from .models import Friend, FriendCode
from accounts.models import User
from django.contrib import messages
import json

@login_required
def friend_list(request):
    # 친구 목록 조회
    friends = Friend.objects.filter(user=request.user).select_related('friend')
    friend_codes = FriendCode.objects.filter(user=request.user).first()
    
    context = {
        'friends': friends,
        'friend_code': friend_codes.code if friend_codes else None
    }
    return render(request, 'friend/friendpage.html', context)

@login_required
def search_friends(request):
    # 친구 검색 기능
    query = request.GET.get('query', '')
    if query:
        friends = Friend.objects.filter(
            user=request.user,
            friend__nickname__icontains=query
        ).select_related('friend')
    else:
        friends = Friend.objects.filter(user=request.user).select_related('friend')
    
    friend_list = [{
        'id': friend.friend.id,
        'username': friend.friend.nickname,
        'profile_image': friend.friend.image.url if friend.friend.image else None
    } for friend in friends]
    
    return JsonResponse({'friends': friend_list})

@login_required
def delete_friend(request, friend_id):
    # 친구 삭제
    try:
        friend = Friend.objects.get(user=request.user, friend_id=friend_id)
        friend.delete()
        return JsonResponse({'status': 'success'})
    except Friend.DoesNotExist:
        return JsonResponse({'status': 'error', 'message': 'Friend not found'}, status=404)

@login_required
def add_friend(request):
    # 친구 추가
    if request.method == 'POST':
        friend_code = request.POST.get('friend_code')
        memo = request.POST.get('memo', '')

        try:
            friend_code_obj = FriendCode.objects.get(code=friend_code)

            if friend_code_obj.user == request.user:
                messages.error(request, '자기 자신은 친구로 추가할 수 없습니다.')
                return redirect('friends:friend_list')

            # 이미 친구인지 확인 (양방향)
            if Friend.objects.filter(
                Q(user=request.user, friend=friend_code_obj.user) |
                Q(user=friend_code_obj.user, friend=request.user)
            ).exists():
                messages.error(request, '이미 추가한 친구입니다!')
                return redirect('friends:friend_list')

            # 친구 관계 생성 (상호 관계)
            new_friend = Friend.objects.create(user=request.user, friend=friend_code_obj.user)
            Friend.objects.create(user=friend_code_obj.user, friend=request.user)

            if memo:
                new_friend.memo = memo
                new_friend.save()

            return redirect('friends:friend_list')

        except FriendCode.DoesNotExist:
            messages.error(request, '유효하지 않은 친구 코드입니다.')
            return redirect('friends:friend_list')

    return redirect('friends:friend_list')

@login_required
def get_friend_profile(request, friend_id):
    # 친구 프로필 정보 조회
    try:
        friend = User.objects.get(id=friend_id)
        profile_data = {
            'id': friend.id,
            'username': friend.nickname,
            'profile_image': friend.image.url if friend.image else None,
            'bio': friend.bio
        }
        return JsonResponse({'status': 'success', 'profile': profile_data})
    except User.DoesNotExist:
        return JsonResponse({'status': 'error', 'message': 'User not found'}, status=404) 

@login_required
def search_by_code(request):
    # 친구 코드로 사용자 정보 조회
    code = request.GET.get('code')
    
    if not code:
        return JsonResponse({'status': 'error', 'message': '친구 코드가 필요합니다.'}, status=400)
    
    try:
        friend_code_obj = FriendCode.objects.get(code=code)
        user = friend_code_obj.user
        
        # 자기 자신인지 확인
        if user == request.user:
            return JsonResponse({'status': 'error', 'message': '자기 자신은 친구로 추가할 수 없습니다.'}, status=400)
        
        user_data = {
            'id': user.id,
            'username': user.username,
            'nickname': user.nickname,
            'profile_image': user.image.url if user.image else None,
            'bio': user.bio
        }
        
        return JsonResponse({'status': 'success', 'user': user_data})
        
    except FriendCode.DoesNotExist:
        return JsonResponse({'status': 'error', 'message': '유효하지 않은 친구 코드입니다.'}, status=404)

@login_required
def update_memo(request, friend_id):
    # 친구 메모 업데이트
    if request.method == 'POST':
        data = json.loads(request.body)
        memo = data.get('memo', '')
        
        # 친구 관계 조회
        friend = Friend.objects.get(user=request.user, friend_id=friend_id)
        
        # 메모 업데이트
        friend.memo = memo
        friend.save()
        
        return JsonResponse({'status': 'success'})
    
    return JsonResponse({'status': 'error'}, status=405)

# Create your views here.
