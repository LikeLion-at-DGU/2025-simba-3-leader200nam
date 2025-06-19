from django.shortcuts import render, redirect
from .forms import SignUpForm

# Create your views here.

def signup(request):
    if request.method == 'POST':
        form = SignUpForm(request.POST)
        if form.is_valid():
            form.save()
            return redirect('login')  # 로그인 페이지로 이동(추후 URL에 맞게 수정)
    else:
        form = SignUpForm()
    return render(request, 'accounts/signup.html', {'form': form})
