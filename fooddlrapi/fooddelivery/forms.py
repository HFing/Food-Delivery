from django import forms
from fooddelivery.models import User, Store, Menu, Food
from cloudinary.forms import CloudinaryFileField


class StoreRegistrationForm(forms.ModelForm):
    store_name = forms.CharField(max_length=255)
    store_description = forms.CharField(widget=forms.Textarea, required=False)
    store_address = forms.CharField(max_length=255)
    store_location = forms.CharField(max_length=255)
    avatar = CloudinaryFileField()

    class Meta:
        model = User
        fields = ['username', 'password', 'email', 'first_name', 'last_name', 'avatar']
        widgets = {
            'password': forms.PasswordInput(),
        }

    def save(self, commit=True):
        user = super().save(commit=False)
        user.role = 'store'
        user.is_store_owner = True
        user.set_password(self.cleaned_data['password'])

        if commit:
            user.save()
            store = Store(
                owner=user,
                name=self.cleaned_data['store_name'],
                description=self.cleaned_data['store_description'],
                address=self.cleaned_data['store_address'],
                location=self.cleaned_data['store_location'],
                is_active=False
            )
            store.save()
        return user

class StoreUpdateForm(forms.ModelForm):
    class Meta:
        model = Store
        fields = ['name', 'description', 'address', 'location']



class MenuForm(forms.ModelForm):
    class Meta:
        model = Menu
        fields = ['name', 'time_slot']

class FoodForm(forms.ModelForm):
    image = CloudinaryFileField(widget=forms.FileInput())

    class Meta:
        model = Food
        fields = ['name', 'price', 'description', 'is_available', 'menu', 'image']