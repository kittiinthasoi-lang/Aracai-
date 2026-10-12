// Media stays unpublished until real licensed audio or video files are added.
export interface MediaEpisode {
  id: string; episode: string; title: string; chapters: string; description: string;
  audioUrl?: string; videoUrl?: string;
}
export const MEDIA_EPISODES: MediaEpisode[] = [{
  id: 'episode-1', episode: '01', title: 'สายใยแรกแห่งชะตา',
  chapters: 'เล่ม 1 บทที่ 1–3',
  description: 'การตั้งชื่อแฝดสาม คืนแห่งการจู่โจม และคำสัญญาที่รับไครอสเข้าสู่ครอบครัว'
  // Once the assets exist, add: audioUrl: '/media/audio/ep01.mp3', videoUrl: '/media/video/ep01.mp4'
}];