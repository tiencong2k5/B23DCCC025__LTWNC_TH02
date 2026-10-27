import type { Song, Genre } from '../types';

const ADJ = ['Mưa', 'Nắng', 'Gió', 'Đêm', 'Phố', 'Biển', 'Mây', 'Sao'];

const NOUN = [
    'tháng Sáu', 'cuối ngày', 'Hà Nội', 'mùa thu', 'xa xôi',
    'bình yên', 'ngày cũ', 'lặng lẽ', 'trong tim', 'mùa hạ',
];


const ARTISTS = ['Lê Minh', 'Hà Anh', 'Tuấn Vũ', 'Ngọc Mai', 'Bảo Trâm','Đức Phúc', 'Thu Hà', 'Quang Huy', 'Mỹ Linh', 'Hoàng Long',];

export const GENRES: Genre[] = ['Pop', 'Ballad', 'Rock', 'Indie', 'Rap'];

export const generateSongs = (count: number): Song[] => 
    Array.from({ length: count }, (_, i) => {
        const name = `${ADJ[i % 8]} ${NOUN[Math.floor(i / 8) % 10]}`;
        return {
            id: `s${i + 1}`,
            title: `${name} ${Math.floor(i / 80) + 1}`,
            artist: ARTISTS[(i * 7) % 10],
            genre: GENRES[(i * 3) % 5],
            duration: 150 + ((i * 37) % 151), // từ 150 đến 300 giây
        };
    });

export const SONGS = generateSongs(10_000);

/* 

Trong ứng dụng, sinh một lần 10.000 bài: export const SONGS = generateSongs(10000);
. Vài bài đầu:s1 “Mưa tháng Sáu 1” – Lê Minh – Pop – 150 giây; 
s2 “Nắng tháng Sáu 1” – Quang Huy – Indie – 187giây; 
s3 “Gió tháng Sáu 1” – Bảo Trâm – Ballad – 224 giây.Thời lượng hiển thị dạng phút:giây bằng 
hàm tự viết formatDuration(seconds: number): string trongsrc/utils/format.ts: 150 →2:30, 65 →1:05, 0 →0:00.
*/