from django.shortcuts import render, redirect
from django.contrib.auth.decorators import login_required
from django.http import JsonResponse
from django.db.models import Q
from .models import Friend, FriendCode
from accounts.models import User
from django.contrib import messages
import json

@login_required
# 로그인한 사용자만 접근 가능한 친구 목록 뷰 함수
def friend_list(request):
    # 현재 사용자의 친구 관계들을 조회
    friends = Friend.objects.filter(user=request.user).select_related('friend')

    # 현재 사용자의 친구 코드를 조회
    friend_codes = FriendCode.objects.filter(user=request.user).first()
    
    # 친구 목록과 친구 코드를 템플릿에 전달
    context = {
        'friends': friends,
        'friend_code': friend_codes.code if friend_codes else None
    }
    return render(request, 'friend/friendpage.html', context)

@login_required
# 로그인한 사용자만 접근 가능한 친구 검색 뷰 함수
def search_friends(request):
    # 검색어 가져오기
    query = request.GET.get('query', '')
    if query:
        # 검색어가 있으면 해당 검색어를 포함한 친구 조회
        friends = Friend.objects.filter(
            user=request.user,
            friend__nickname__icontains=query
        ).select_related('friend')
    else:
        # 검색어가 없으면 모든 친구 조회
        friends = Friend.objects.filter(user=request.user).select_related('friend')
    
    # 친구 목록 형식 변환
    friend_list = [{
        'id': friend.friend.id,
        'username': friend.friend.nickname,
        'profile_image': friend.friend.image.url if friend.friend.image else None
    } for friend in friends]
    
    return JsonResponse({'friends': friend_list})

@login_required
# 로그인한 사용자만 접근 가능한 친구 삭제 뷰 함수
def delete_friend(request, friend_id):
    # 친구 삭제 
    try:
        friend = Friend.objects.get(user=request.user, friend_id=friend_id)
        friend.delete()
        return JsonResponse({'status': 'success'})
    except Friend.DoesNotExist:
        return JsonResponse({'status': 'error', 'message': 'Friend not found'}, status=404)

@login_required
# 로그인한 사용자만 접근 가능한 친구 추가 뷰 함수
def add_friend(request):
    # 친구 추가
    if request.method == 'POST':
        print("=== 친구 추가 요청 시작 ===")
        print(f"POST 데이터: {dict(request.POST)}")
        
        friend_code = request.POST.get('friend_code')
        memo = request.POST.get('memo', '')
        
        print(f"친구 코드: {friend_code}")
        print(f"메모: {memo}")

        if not friend_code:
            print("친구 코드가 없음")
            return JsonResponse({'status': 'error', 'message': '친구 코드가 필요합니다.'}, status=400)

        try:
            # 친구 코드로 사용자 찾기: code=friend_code로 해당 코드를 가진 사용자 조회
            friend_code_obj = FriendCode.objects.get(code=friend_code)
            print(f"찾은 친구 코드 객체: {friend_code_obj}")

            if friend_code_obj.user == request.user:
                print("자기 자신을 친구로 추가하려고 함")
                return JsonResponse({'status': 'error', 'message': '자기 자신은 친구로 추가할 수 없습니다.'}, status=400)

            # 이미 친구인지 확인 (양방향)
            existing_friend = Friend.objects.filter(
                Q(user=request.user, friend=friend_code_obj.user) |
                Q(user=friend_code_obj.user, friend=request.user)
            ).exists()
            
            print(f"이미 친구인지 확인: {existing_friend}")
            
            if existing_friend:
                return JsonResponse({'status': 'error', 'message': '이미 추가한 친구입니다!'}, status=400)

            # 친구 관계 생성 (상호 관계)
            print("친구 관계 생성 시작")
            new_friend, created1 = Friend.objects.get_or_create(
                user=request.user, 
                friend=friend_code_obj.user,
                defaults={'memo': memo}
            )
            print(f"첫 번째 친구 관계 생성: {new_friend}, 생성됨: {created1}")
            
            new_friend2, created2 = Friend.objects.get_or_create(
                user=friend_code_obj.user, 
                friend=request.user
            )
            print(f"두 번째 친구 관계 생성: {new_friend2}, 생성됨: {created2}")

            print("친구 추가 성공")
            return JsonResponse({'status': 'success', 'message': '친구가 추가되었습니다!'})

        except FriendCode.DoesNotExist:
            print(f"친구 코드를 찾을 수 없음: {friend_code}")
            return JsonResponse({'status': 'error', 'message': '유효하지 않은 친구 코드입니다.'}, status=404)
        except Exception as e:
            print(f"친구 추가 중 오류 발생: {str(e)}")
            import traceback
            traceback.print_exc()
            return JsonResponse({'status': 'error', 'message': f'친구 추가 중 오류가 발생했습니다: {str(e)}'}, status=500)

    return JsonResponse({'status': 'error', 'message': 'POST 요청만 허용됩니다.'}, status=405)

@login_required
# 로그인한 사용자만 접근 가능한 친구 코드로 사용자 검색 뷰 함수
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
        
        # 디버깅: 사용자 데이터 확인
        print(f"사용자 데이터: {user_data}")
        print(f"프로필 이미지: {user_data['profile_image']}")
        
        # 이미 이미 추가된 친구인지 확인
        already_added = Friend.objects.filter(
            user=request.user, 
            friend=user
        ).exists()
        
        return JsonResponse({
            'status': 'success', 
            'user': user_data,
            'already_added': already_added
        })
        
    except FriendCode.DoesNotExist:
        return JsonResponse({'status': 'error', 'message': '유효하지 않은 친구 코드입니다.'}, status=404)

@login_required
# 로그인한 사용자만 접근 가능한 친구 메모 업데이트 뷰 함수
def update_memo(request, friend_id):
    # 친구 메모 업데이트
    if request.method == 'POST':
        data = json.loads(request.body)
        memo = data.get('memo', '')
        
        # 친구 관계 조회: user=request.user, friend_id=friend_id로 해당 친구 관계 조회
        friend = Friend.objects.get(user=request.user, friend_id=friend_id)
        
        # 메모 업데이트
        friend.memo = memo
        friend.save()
        
        return JsonResponse({'status': 'success'})
    
    return JsonResponse({'status': 'error'}, status=405)


