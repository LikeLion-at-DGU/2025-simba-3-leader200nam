from rest_framework import serializers
from django.contrib.auth import authenticate
from .models import User

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    password2 = serializers.CharField(write_only=True)
    image = serializers.ImageField(required=False)
    bio = serializers.CharField(required=False)
    nickname = serializers.CharField()

    class Meta:
        model = User
        fields = ('school_name', 'department', 'student_id', 'nickname', 'image', 'bio', 'password', 'password2')

    def validate(self, data):
        if data['password'] != data['password2']:
            raise serializers.ValidationError('비밀번호가 일치하지 않습니다.')
        if User.objects.filter(student_id=data['student_id']).exists():
            raise serializers.ValidationError('이미 사용 중인 학번(아이디)입니다.')
        if User.objects.filter(nickname=data['nickname']).exists():
            raise serializers.ValidationError('이미 사용 중인 닉네임입니다.')
        return data

    def create(self, validated_data):
        validated_data.pop('password2')
        user = User.objects.create_user(**validated_data)
        return user

class LoginSerializer(serializers.Serializer):
    student_id = serializers.CharField()
    password = serializers.CharField(write_only=True)

    def validate(self, data):
        user = authenticate(student_id=data['student_id'], password=data['password'])
        if user is None:
            raise serializers.ValidationError('학번 또는 비밀번호가 올바르지 않습니다.')
        data['user'] = user
        return data 