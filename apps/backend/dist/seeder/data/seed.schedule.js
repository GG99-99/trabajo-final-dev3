import prisma from "@final/db";
const schedule_seed = [{
        schedule_id: 1,
        "worker_id": 2,
        "seat_id": 2,
        "monday": {
            "start": "09:00",
            "end": "18:00",
            "active": true,
            "breaks": [
                { "start": "13:00", "end": "14:00" }
            ]
        },
        "tuesday": {
            "start": "09:00",
            "end": "18:00",
            "active": true,
            "breaks": [
                { "start": "13:00", "end": "14:00" }
            ]
        },
        "wednesday": {
            "start": "09:00",
            "end": "18:00",
            "active": true,
            "breaks": [
                { "start": "13:00", "end": "14:00" }
            ]
        },
        "thursday": {
            "start": "09:00",
            "end": "18:00",
            "active": true,
            "breaks": [
                { "start": "13:00", "end": "14:00" }
            ]
        },
        "friday": {
            "start": "09:00",
            "end": "17:00",
            "active": true,
            "breaks": [
                { "start": "13:00", "end": "14:00" }
            ]
        },
        "saturday": {
            "start": "10:00",
            "end": "14:00",
            "active": true,
            "breaks": []
        },
        "sunday": {
            "start": "00:00",
            "end": "00:00",
            "active": false,
            "breaks": []
        }
    }];
export async function seedSchedule() {
    for (const s of schedule_seed) {
        await prisma.schedule.upsert({
            where: { schedule_id: s.schedule_id },
            update: {},
            create: { ...s }
        });
    }
}
//# sourceMappingURL=seed.schedule.js.map