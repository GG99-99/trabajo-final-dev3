import prisma from "@final/db"
import { ApiErr } from "@final/shared"

const todayStr = () => {
    const d = new Date()
    return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`
}

export const punchService = {

    /** Get or create today's attendance record */
    getOrCreateAttendance: async () => {
        const today = todayStr()
        const existing = await prisma.attendance.findFirst({
            where: { day: today, is_deleted: false }
        })
        if (existing) return existing
        return await prisma.attendance.create({
            data: { day: today, work_date: new Date(), status: true }
        })
    },

    /** Clock IN — start of shift */
    clockIn: async (worker_id: number) => {
        const attendance = await punchService.getOrCreateAttendance()

        // Check if already clocked in today
        const existing = await prisma.assist.findUnique({
            where: { worker_id_attendance_id: { worker_id, attendance_id: attendance.attendance_id } }
        })
        if (existing) {
            throw { statusCode: 409, name: 'AlreadyClockedIn', message: 'Ya registraste tu entrada hoy.' } as ApiErr
        }

        return await prisma.assist.create({
            data: {
                worker_id,
                attendance_id: attendance.attendance_id,
                start: new Date(),
                alert: false,
            },
            include: { worker: { include: { person: true } }, attendance: true }
        })
    },

    /** Clock OUT — end of shift */
    clockOut: async (worker_id: number) => {
        const attendance = await punchService.getOrCreateAttendance()

        const assist = await prisma.assist.findUnique({
            where: { worker_id_attendance_id: { worker_id, attendance_id: attendance.attendance_id } }
        })

        if (!assist) {
            throw { statusCode: 409, name: 'NotClockedIn', message: 'No has registrado tu entrada hoy.' } as ApiErr
        }
        if (assist.close) {
            throw { statusCode: 409, name: 'AlreadyClockedOut', message: 'Ya registraste tu salida hoy.' } as ApiErr
        }

        return await prisma.assist.update({
            where: { worker_id_attendance_id: { worker_id, attendance_id: attendance.attendance_id } },
            data: { close: new Date() },
            include: { worker: { include: { person: true } }, attendance: true }
        })
    },

    /** Get today's status for a worker */
    getTodayStatus: async (worker_id: number) => {
        const attendance = await prisma.attendance.findFirst({
            where: { day: todayStr(), is_deleted: false }
        })
        if (!attendance) return { clocked_in: false, clocked_out: false, assist: null }

        const assist = await prisma.assist.findUnique({
            where: { worker_id_attendance_id: { worker_id, attendance_id: attendance.attendance_id } },
            include: { worker: { include: { person: true } }, attendance: true }
        })

        return {
            clocked_in:  !!assist,
            clocked_out: !!assist?.close,
            assist
        }
    },

    /** Get history for a worker (or all workers) */
    getHistory: async (filters: { worker_id?: number; date?: string }) => {
        return await prisma.assist.findMany({
            where: {
                ...(filters.worker_id && { worker_id: filters.worker_id }),
                ...(filters.date && {
                    attendance: { day: filters.date }
                }),
                is_deleted: false,
            },
            include: {
                worker: { include: { person: true } },
                attendance: true,
            },
            orderBy: { start: 'desc' }
        })
    },
}
