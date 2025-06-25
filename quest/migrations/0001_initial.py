# 필요한 모듈 import
from django.db import migrations, models

# Django 마이그레이션 기본 클래스 상속
# 모든 마이그레이션 파일은 Migration 클래스를 하나 선언해야 함
class Migration(migrations.Migration):
    # 초기 마이그레이션 플래그 - 앱의 첫 번째 마이그레이션임을 표시
    initial = True
    # 실제 데이터베이스에 적용할 작업(연산)들을 차례대로 담아두는 리스트입니다.
    operations = [
        # 새 모델(테이블)을 생성하라는 지시
        migrations.CreateModel(
            # 모델 이름(테이블 이름) → Quest
            name='Quest',
            # 테이블에 들어갈 열(필드)들을 정의하는 곳
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, verbose_name='ID')),
                ('month', models.PositiveSmallIntegerField()),
                ('week', models.PositiveSmallIntegerField()),
                ('title', models.CharField(max_length=100)),
                ('description', models.TextField()),
                ('exp', models.PositiveIntegerField(default=30)),
            ],
        ),
    ]
