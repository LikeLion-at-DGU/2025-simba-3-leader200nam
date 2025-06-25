from django import forms #Django의 폼 기능을 사용
from django.contrib.auth.forms import UserCreationForm #비밀번호1, 비밀번호2 입력 필드, 유효성 검사 내장
from .models import User #accounts의 models.py에 정의된 User 모델을 가져옴

class SignUpForm(UserCreationForm): #커스텀 회원가입 폼을 만드는 클래스
    username = forms.CharField( #username 필드를 직접 정의, 아이디 입력란 커스텀
        max_length=150, # 최대 길이
        label='아이디', #HTML <label> 태그 안에 들어갈 내용
        widget=forms.TextInput(attrs={'placeholder': '사용할 아이디를 입력해주세요.'}),
        help_text='영문, 숫자, 특수문자만 사용 가능합니다.'
    )
    univ_name = forms.CharField(
        max_length=100,
        label='학교명',
        widget=forms.TextInput(attrs={'placeholder': '본인의 학교를 입력해주세요.'}),
        help_text='OO대학교 형식으로 입력해주세요. (ex. 동국대학교, 건국대학교)'
    )
    major_name = forms.CharField(
        max_length=100,
        label='학과명',
        widget=forms.TextInput(attrs={'placeholder': '본인의 학과를 입력해주세요.'}),
        help_text='공식명칭으로 입력해주세요. (ex. 경영 -> 경영학과)'
    )

    class Meta:
        model = User
        fields = ('username', 'univ_name', 'major_name', 'password1', 'password2')

    def clean(self): #아이디 중복 검사
        cleaned_data = super().clean() #부모 클래스의 clean 메서드 호출
        username = cleaned_data.get('username') #입력된 아이디 가져오기 
        # 아이디 중복 검사
        if username and User.objects.filter(username=username).exists():
            raise forms.ValidationError('이미 사용 중인 아이디입니다.')
        return cleaned_data

    def save(self, commit=True): #회원가입 처리
        user = super().save(commit=False)
        if commit:
            user.save()
        return user

class LoginForm(forms.Form):
    username = forms.CharField(
        label='아이디',
        widget=forms.TextInput(attrs={'placeholder': '아이디를 입력해주세요.'})
    )
    password = forms.CharField(
        label='비밀번호',
        widget=forms.PasswordInput(attrs={'placeholder': '비밀번호를 입력해주세요.'})
    )

class ProfileUpdateForm(forms.ModelForm):
    class Meta:
        model = User
        fields = ('nickname', 'major_name', 'bio', 'image')
        widgets = {
            'bio': forms.Textarea(attrs={'placeholder': '자기소개를 입력해주세요.'}),
        } 