# views.py: DRF nézetek és végpontok
# Itt kezeljük a bejövő kéréseket (GET, POST, PUT, DELETE) és 
# hívjuk meg a megfelelő szerializálókat / model műveleteket.

from rest_framework import viewsets, status
from rest_framework.permissions import BasePermission, IsAuthenticated
from rest_framework.views import APIView
from rest_framework.response import Response
from .models import Book
from .serializers import BookSerializer, RegisterSerializer
from rest_framework.decorators import api_view
from django.contrib.auth.models import User
from django.db import IntegrityError
from rest_framework.exceptions import ValidationError
from rest_framework_simplejwt.tokens import RefreshToken
from django.db import connection

# current_user: Egy egyszerű végpont, ami visszaadja a belépett felhasználó nevét
@api_view(['GET'])
def current_user(request):
    if request.user.is_authenticated:
        return Response({
            "username": request.user.username,
            "email": request.user.email
        })
    return Response({"error": "User is not authenticated."}, status=status.HTTP_401_UNAUTHORIZED)


# IsOwner jogosultsági osztály: csak a tulajdonos férhet hozzá az objektum műveleteihez
class IsOwner(BasePermission):
    def has_object_permission(self, request, view, obj):
        return obj.owner == request.user


# BookViewSet: Könyvek CRUD műveletei (ModelViewSet)
class BookViewSet(viewsets.ModelViewSet):
    serializer_class = BookSerializer
    permission_classes = [IsAuthenticated]
    queryset = Book.objects.none()

    def get_queryset(self):
        """
        A listázási (GET /books/) kérésnél minden könyvet megjelenít.
        Szerkesztés és törlés esetén csak a bejelentkezett felhasználó könyveit engedi.
        """
        if self.action in ['update', 'partial_update', 'destroy']:
            return Book.objects.filter(owner=self.request.user)  # Csak a saját könyvekre szűr

        if self.action == 'list':
            search_query = self.request.query_params.get('search', '').strip()
            if search_query:
                return Book.objects.filter(title__icontains=search_query)  # Keresés a cím alapján
            return Book.objects.all()  # Minden könyvet visszaad listázáskor

        return super().get_queryset()

    def get_permissions(self):
        # update, partial_update, destroy esetén ellenőrizzük, hogy a felhasználó tulajdonos-e
        if self.action in ['update', 'partial_update', 'destroy']:
            self.permission_classes = [IsAuthenticated, IsOwner]
        else:
            self.permission_classes = [IsAuthenticated]
        return super().get_permissions()

    # Új könyv létrehozásakor beállítjuk az owner és author mezőket
    def perform_create(self, serializer):
        title = serializer.validated_data.get("title", "")
        description = serializer.validated_data.get("description", "")

        # Alapvető validációk
        if len(title) < 3:
            raise ValidationError({"title": "Title must be at least 3 characters long."})
        if len(description) > 500:
            raise ValidationError({"description": "Description cannot exceed 500 characters."})

        # Biztonságos mentés
        try:
            serializer.save(owner=self.request.user)
        except IntegrityError:
            raise ValidationError({"error": "A book with this title already exists for this user."})


# Egyedi végpont: Keresés könyvek címe alapján (paraméterezett SQL)
@api_view(['GET'])
def books_by_title(request):
    title = request.query_params.get('title', '').strip()

    # Paraméterezett lekérdezés a biztonság érdekében
    with connection.cursor() as cursor:
        cursor.execute("SELECT * FROM books WHERE title LIKE %s", [f"%{title}%"])
        rows = cursor.fetchall()

    # Adatok visszaküldése
    return Response({"books": rows})


# RegisterView: Felhasználó regisztrációjához API végpont
class RegisterView(APIView):
    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({"message": "User registered successfully"}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
def logout_view(request):
    try:
        refresh_token = request.data.get("refresh_token")
        token = RefreshToken(refresh_token)
        token.blacklist()
        return Response({"message": "Logout successful."}, status=status.HTTP_205_RESET_CONTENT)
    except Exception as e:
        return Response({"error": "Invalid token."}, status=status.HTTP_400_BAD_REQUEST)
