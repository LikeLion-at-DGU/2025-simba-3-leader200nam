from django import forms
from django.contrib.auth.forms import UserCreationForm
from .models import User

class SignUpForm(UserCreationForm):
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
        label='학번(아이디)',
        widget=forms.TextInput(attrs={'placeholder': '본인의 학번을 입력해주세요.'}),
        help_text='숫자만 입력해주세요.'
    )
    password = forms.CharField(
        label='비밀번호',
        widget=forms.PasswordInput(attrs={'placeholder': '비밀번호를 입력해주세요.'}),
        help_text='한글, 숫자, 영문으로 4~12자 이내로 작성해주세요.'
    )
    password_check = forms.CharField(
        label='비밀번호 확인',
        widget=forms.PasswordInput(attrs={'placeholder': '비밀번호를 다시 입력해주세요.'}),
        help_text='입력한 비밀번호와 똑같이 입력해주세요.'
    )

    def save(self, commit=True):
      user = super().save(commit=False)
      user.set_password(self.cleaned_data["password"])
      if commit:
          user.save()
      return user

    class Meta:
        model = User
        fields = ('univ_name', 'major_name', 'number_name', 'password', 'password_check')

    def clean_number_name(self):
        number_name = self.cleaned_data.get('number_name')
        if User.objects.filter(number_name=number_name).exists():
            raise forms.ValidationError('이미 사용 중인 학번(아이디)입니다.')
        return number_name
    

class LoginForm(forms.Form):
    number_name = forms.CharField(
        label='학번(아이디)',
        widget=forms.TextInput(attrs={'placeholder': '학번을 입력해주세요.'})
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