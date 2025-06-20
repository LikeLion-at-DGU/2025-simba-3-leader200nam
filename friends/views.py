from django.shortcuts import render, redirect
from django.contrib.auth.decorators import login_required
from django.http import JsonResponse
from django.db.models import Q
from .models import Friend, FriendCode
from accounts.models import User

@login_required
def friend_list(request):
    # 친구 목록 조회
    friends = Friend.objects.filter(user=request.user).select_related('friend')
    friend_codes = FriendCode.objects.filter(user=request.user).first()
    
    context = {
        'friends': friends,
        'friend_code': friend_codes.code if friend_codes else None
    }
    return render(request, 'friend/friend_list.html', context)

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
        try:
            friend_code_obj = FriendCode.objects.get(code=friend_code)
            if friend_code_obj.user == request.user:
                return JsonResponse({'status': 'error', 'message': 'Cannot add yourself as friend'})
            
            # 이미 친구인지 확인
            if Friend.objects.filter(user=request.user, friend=friend_code_obj.user).exists():
                return JsonResponse({'status': 'error', 'message': 'Already friends'})
            
            # 친구 관계 생성
            Friend.objects.create(user=request.user, friend=friend_code_obj.user)
            Friend.objects.create(user=friend_code_obj.user, friend=request.user)
            
            return JsonResponse({
                'status': 'success',
                'friend': {
                    'id': friend_code_obj.user.id,
                    'username': friend_code_obj.user.nickname,
                    'profile_image': friend_code_obj.user.image.url if friend_code_obj.user.image else None
                }
            })
        except FriendCode.DoesNotExist:
            return JsonResponse({'status': 'error', 'message': 'Invalid friend code'}, status=404)
    
    return JsonResponse({'status': 'error', 'message': 'Invalid request method'}, status=400)

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

# Create your views here.
