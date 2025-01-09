# serializers.py: DRF szerializálók
# A modellek adatainak átalakítása JSON formátumra, 
# illetve bejövő JSON feldolgozása a modellekhez.

from rest_framework import serializers
from .models import Book, Favourite
from django.contrib.auth.models import User

# BookSerializer: A Book modelt szerializáljuk,
# az owner és author mezőket csak olvasható szövegként kezeljük.
class BookSerializer(serializers.ModelSerializer):
    owner = serializers.StringRelatedField(read_only=True)

    class Meta:
        model = Book
        fields = ['id', 'title', 'description', 'owner', 'created_at']

    def validate_title(self, value):
        """
        Validáljuk, hogy a cím legalább 3 karakter hosszú legyen.
        """
        if len(value) < 3:
            raise serializers.ValidationError("Title must be at least 3 characters long.")
        return value

    def validate_description(self, value):
        """
        Validáljuk, hogy a leírás ne haladja meg az 500 karaktert.
        """
        if len(value) > 500:
            raise serializers.ValidationError("Description cannot exceed 500 characters.")
        return value

# RegisterSerializer: Felhasználó regisztrációjához szükséges szerializáló.
class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ['username', 'password', 'email']

    def validate_username(self, value):
        """
        Validáljuk, hogy a felhasználónév csak alfanumerikus karaktereket tartalmazzon,
        és legalább 3 és legfeljebb 20 karakter hosszú legyen.
        """
        if not value.isalnum():
            raise serializers.ValidationError("Username must contain only alphanumeric characters.")
        if len(value) < 3 or len(value) > 20:
            raise serializers.ValidationError("Username must be between 3 and 20 characters.")
        return value

    def validate_email(self, value):
        """
        Validáljuk, hogy az email formátum helyes legyen.
        """
        if not "@" in value or not "." in value.split("@")[-1]:
            raise serializers.ValidationError("Enter a valid email address.")
        return value

    def validate_password(self, value):
        """
        Validáljuk, hogy a jelszó legalább 6 karakter hosszú legyen.
        """
        if len(value) < 6:
            raise serializers.ValidationError("Password must be at least 6 characters long.")
        return value

    def create(self, validated_data):
        """
        Felhasználó létrehozása validált adatok alapján.
        """
        # Ellenőrizzük, hogy az email cím már létezik-e
        if User.objects.filter(email=validated_data['email']).exists():
            raise serializers.ValidationError({"email": "This email is already in use."})

        # Új felhasználó létrehozása a megadott adatokkal
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password']
        )
        return user


class FavouriteSerializer(serializers.ModelSerializer):
    book = serializers.PrimaryKeyRelatedField(queryset=Book.objects.all())

    class Meta:
        model = Favourite
        fields = ['id', 'user', 'book', 'added_at']
        extra_kwargs = {
            'user': {'read_only': True},
        }
