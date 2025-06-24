
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('friends', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            # 친구 모델 이름
            model_name='friend',
            # 친구 모델 필드 이름
            name='memo',
            # 친구 모델 필드 정의: 친구 관계에 대한 메모를 저장하는 필드
            field=models.CharField(blank=True, max_length=255, null=True),
        ),
    ]
