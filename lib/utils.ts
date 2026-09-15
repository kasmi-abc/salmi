import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDA(amount: number) {
  return new Intl.NumberFormat('fr-DZ', { style: 'decimal' }).format(amount) + ' DA'
}

export const WILAYAS = [
  "01 - Adrar","02 - Chlef","03 - Laghouat","04 - Oum El Bouaghi","05 - Batna","06 - Béjaïa","07 - Biskra","08 - Béchar","09 - Blida","10 - Bouira","11 - Tamanrasset","12 - Tébessa","13 - Tlemcen","14 - Tiaret","15 - Tizi Ouzou","16 - Alger","17 - Djelfa","18 - Jijel","19 - Sétif","20 - Saïda","21 - Skikda","22 - Sidi Bel Abbès","23 - Annaba","24 - Guelma","25 - Constantine","26 - Médéa","27 - Mostaganem","28 - M'Sila","29 - Mascara","30 - Ouargla","31 - Oran","32 - El Bayadh","33 - Illizi","34 - Bordj Bou Arreridj","35 - Boumerdès","36 - El Tarf","37 - Tindouf","38 - Tissemsilt","39 - El Oued","40 - Khenchela","41 - Souk Ahras","42 - Tipaza","43 - Mila","44 - Aïn Defla","45 - Naâma","46 - Aïn Témouchent","47 - Ghardaïa","48 - Relizane","49 - Timimoun","50 - Bordj Badji Mokhtar","51 - Ouled Djellal","52 - Béni Abbès","53 - In Salah","54 - In Guezzam","55 - Touggourt","56 - Djanet","57 - El M'Ghair","58 - El Meniaa","59 - Hassi Khébi","60 - Ouled Rahma","61 - Berrouaghia","62 - Sidi Aissa","63 - Bou Saada","64 - Aflou","65 - Barika","66 - Bir El Ater","67 - Hammam Bou Hadjar","68 - Telagh","69 - El Kseur",
]

export function slugify(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
}

export function debounce<T extends (...args: any[]) => any>(fn: T, ms = 300) {
  let timer: ReturnType<typeof setTimeout>
  return (...args: Parameters<T>) => {
    clearTimeout(timer)
    timer = setTimeout(() => fn(...args), ms)
  }
}
