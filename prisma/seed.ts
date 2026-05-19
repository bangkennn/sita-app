import { PrismaClient, Role } from "@prisma/client"
import bcrypt from "bcryptjs"

const prisma = new PrismaClient()

async function main() {
  const passwordAdmin = await bcrypt.hash("Admin123!", 10)
  const passwordDosen = await bcrypt.hash("Dosen123!", 10)
  const passwordMhs = await bcrypt.hash("Mhs123!", 10)

  await prisma.user.upsert({
    where: { email: "admin@sita.ac.id" },
    update: {},
    create: {
      email: "admin@sita.ac.id",
      password: passwordAdmin,
      role: Role.ADMIN,
    },
  })

  const dosenData = [
    {
      email: "budi@sita.ac.id",
      nama: "Dr. Budi Santoso",
      nip: "197001012000031001",
      prodi: "Teknik Informatika",
    },
    {
      email: "sari@sita.ac.id",
      nama: "Dr. Sari Dewi",
      nip: "197501012000032001",
      prodi: "Sistem Informasi",
    },
  ] as const

  for (const d of dosenData) {
    await prisma.user.upsert({
      where: { email: d.email },
      update: {},
      create: {
        email: d.email,
        password: passwordDosen,
        role: Role.DOSEN,
        dosen: {
          create: {
            nama: d.nama,
            nip: d.nip,
            prodi: d.prodi,
          },
        },
      },
    })
  }

  const mahasiswaData = [
    {
      email: "mhs1@test.com",
      nama: "Andi Pratama",
      nim: "20210001",
      prodi: "Teknik Informatika",
      angkatan: 2021,
    },
    {
      email: "mhs2@test.com",
      nama: "Budi Santoso",
      nim: "20210002",
      prodi: "Sistem Informasi",
      angkatan: 2021,
    },
  ] as const

  for (const m of mahasiswaData) {
    await prisma.user.upsert({
      where: { email: m.email },
      update: {},
      create: {
        email: m.email,
        password: passwordMhs,
        role: Role.MAHASISWA,
        mahasiswa: {
          create: {
            nama: m.nama,
            nim: m.nim,
            prodi: m.prodi,
            angkatan: m.angkatan,
          },
        },
      },
    })
  }

  console.log("Seed selesai.")
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
