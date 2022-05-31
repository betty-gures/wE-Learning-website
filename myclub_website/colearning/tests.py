from django.test import TestCase
from colearning.models import Room


class RoomTestCase(TestCase):

    def setUp(self):
        room = Room.objects.create(name="Oda1")

    def test_room_name(self):
        room = Room.objects.get(id=1)
        self.assertEqual(room.name, room.name.capitalize())