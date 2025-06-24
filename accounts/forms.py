from django import forms
from django.contrib.auth.forms import UserCreationForm
from .models import User

class SignUpForm(UserCreationForm):
    username = forms.CharField(
        max_length=150,
        label='아이디',
        widget=forms.TextInput(attrs={'placeholder': '사용할 아이디를 입력해주세요.'}),
        help_text='영문, 숫자, 특수문자(_)만 사용 가능합니다.'
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
    number_name = forms.CharField(
        max_length=20,
        label='학번',
        widget=forms.TextInput(attrs={'placeholder': '본인의 학번을 입력해주세요.'}),
        help_text='숫자만 입력해주세요.'
    )

    class Meta:
        model = User
        fields = ('username', 'univ_name', 'major_name', 'number_name', 'password1', 'password2')

    def clean(self):
        cleaned_data = super().clean()
        username = cleaned_data.get('username')
        number_name = cleaned_data.get('number_name')
        univ_name = cleaned_data.get('univ_name')
        
        # 아이디 중복 검사
        if username and User.objects.filter(username=username).exists():
            raise forms.ValidationError('이미 사용 중인 아이디입니다.')
        
        # 학번과 학교 조합 중복 검사
        if number_name and univ_name:
            if User.objects.filter(number_name=number_name, univ_name=univ_name).exists():
                raise forms.ValidationError('이미 해당 학교에서 사용 중인 학번입니다.')
        
        return cleaned_data

    def save(self, commit=True):
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