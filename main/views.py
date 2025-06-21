from django.shortcuts import render, redirect
from django.contrib.auth.decorators import login_required
from accounts.models import User

def mainpage(request):
    user=User.objects.all();
    return render(request, 'main/mainpage.html')

def intropage(request):
    return render(request, 'intro/intropage.html')

def signin(request):
    return render(request, 'signin.html')

def signup(request):
    return render(request, 'signup.html')

def introInputPage(request):
    return render(request, 'intro/introInputPage.html')

def registeration(request):
    return render(request, 'main/registeration.html')

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