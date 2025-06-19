from django import forms
from django.contrib.auth.forms import UserCreationForm
from .models import User

class SignUpForm(UserCreationForm):
    school_name = forms.CharField(
        max_length=100,
        label='학교명',
        widget=forms.TextInput(attrs={'placeholder': '본인의 학교를 입력해주세요.'}),
        help_text='OO대학교 형식으로 입력해주세요. (ex. 동국대학교, 건국대학교)'
    )
    department = forms.CharField(
        max_length=100,
        label='학과명',
        widget=forms.TextInput(attrs={'placeholder': '본인의 학과를 입력해주세요.'}),
        help_text='공식명칭으로 입력해주세요. (ex. 경영 -> 경영학과)'
    )
    student_id = forms.CharField(
        max_length=20,
        label='학번(아이디)',
        widget=forms.TextInput(attrs={'placeholder': '본인의 학번을 입력해주세요.'}),
        help_text='숫자만 입력해주세요.'
    )
    password1 = forms.CharField(
        label='비밀번호',
        widget=forms.PasswordInput(attrs={'placeholder': '비밀번호를 입력해주세요.'}),
        help_text='한글, 숫자, 영문으로 4~12자 이내로 작성해주세요.'
    )
    password2 = forms.CharField(
        label='비밀번호 확인',
        widget=forms.PasswordInput(attrs={'placeholder': '비밀번호를 다시 입력해주세요.'}),
        help_text='입력한 비밀번호와 똑같이 입력해주세요.'
    )

    class Meta:
        model = User
        fields = ('school_name', 'department', 'student_id', 'password1', 'password2')

    def clean_student_id(self):
        student_id = self.cleaned_data.get('student_id')
        if User.objects.filter(student_id=student_id).exists():
            raise forms.ValidationError('이미 사용 중인 학번(아이디)입니다.')
        return student_id 
        
class LoginForm(forms.Form):
    student_id = forms.CharField(
        label='학번(아이디)',
        widget=forms.TextInput(attrs={'placeholder': '학번을 입력해주세요.'})
    )
    password = forms.CharField(
        label='비밀번호',
        widget=forms.PasswordInput(attrs={'placeholder': '비밀번호를 입력해주세요.'})
    ) 