import type { Capability, Collection, MemoryItem } from './types';

export const demoScope = {
  name: 'Demo Memory Library',
  type: 'synthetic-preview',
  status: 'demo-data',
  note: 'All records are fictional examples for interface development. They are not stored on or retrieved from a UGREEN NAS.',
};

export const demoCapabilities: Capability[] = [
  { name: 'Photo memory search', agent: 'photo-agent', status: 'documented', detail: 'ug-photo search-picture, search-screen, search-classify, meta, vision-ocr, vision-vlm' },
  { name: 'Read-only timeline summary', agent: 'photo-agent', status: 'documented', detail: 'ug-photo timeline-summary' },
  { name: 'Album creation', agent: 'photo-agent', status: 'approval-required', detail: 'ug-photo create-album with source-ref, add-item, or query' },
  { name: 'File and personal video discovery', agent: 'file-agent', status: 'documented', detail: 'ug-filesystem find/ls/stat plus ug-filemgr mediainfo' },
  { name: 'Document metadata and QA', agent: 'document-agent', status: 'documented', detail: 'ug-document metadata, extract, qa' },
  { name: 'Catalog movie and series search', agent: 'media-agent', status: 'documented', detail: 'ug-video search' },
  { name: 'Personal video content understanding', agent: 'unavailable', status: 'unsupported', detail: 'No catalog Action provides arbitrary personal-video visual search' },
];

const covers = {
  violet: { from: '#6d5df6', to: '#c9bdff', accent: '#a8c7f7' },
  iris: { from: '#8b7cf6', to: '#e6defc', accent: '#9a8ceb' },
  sky: { from: '#5b8def', to: '#cfe4ff', accent: '#a8c7f7' },
  lilac: { from: '#a78bfa', to: '#efe9ff', accent: '#c4b5fd' },
  dusk: { from: '#4f46e5', to: '#c7d2fe', accent: '#a5b4fc' },
  dawn: { from: '#7c3aed', to: '#ddd6fe', accent: '#c4b5fd' },
};

const previewImages: Record<string, string> = {
  'memory-graduation-2025': '/demo/graduation.jpg',
  'memory-farewell-2025': '/demo/farewell.jpg',
  'memory-final-lecture-2025': '/demo/lecture.jpg',
  'memory-presentation-2024': '/demo/presentation.jpg',
  'memory-birthday-2025': '/demo/birthday.jpg',
  'memory-family-dinner-2024': '/demo/family-dinner.jpg',
  'memory-grandparents-2024': '/demo/grandparents.jpg',
  'memory-holiday-table-2024': '/demo/holiday-table.jpg',
  'memory-diwali-lights-2024': '/demo/diwali-lights.jpg',
  'memory-diwali-dinner-2024': '/demo/diwali-dinner.jpg',
  'memory-holi-2025': '/demo/holi.jpg',
  'memory-christmas-2024': '/demo/christmas.jpg',
  'memory-beach-vacation-2024': '/demo/beach.jpg',
  'memory-mountain-overlook-2024': '/demo/mountain.jpg',
  'memory-city-break-2024': '/demo/city.jpg',
  'memory-december-walk-2025': '/demo/december-walk.jpg',
  'memory-new-year-2025': '/demo/new-year.jpg',
};

function withDemoPreview(item: MemoryItem): MemoryItem {
  const previewUrl = previewImages[item.id];
  if (!previewUrl || item.kind !== 'photo') return item;
  return { ...item, previewAvailable: true, previewUrl };
}

const demoMemoryRecords: MemoryItem[] = [
  {
    id: 'memory-graduation-2025', kind: 'photo', title: 'Graduation ceremony', fileName: 'graduation-ceremony-2025.jpg',
    path: 'Demo Library/Photos/2025/graduation-ceremony-2025.jpg', date: '2025-05-24', dateField: 'capture_time', uploadDate: '2025-05-26',
    location: 'Demo University Main Ground', camera: 'DemoCamera X1', tags: ['college', 'graduation', 'ceremony'], collectionIds: ['college-life', 'celebrations'],
    matchReasons: ['Filename contains graduation', 'Capture date is in 2025', 'Demo scene evidence suggests ceremony'], confidence: 'strong',
    description: 'Synthetic demo photo for a graduation memory.', evidence: ['filename', 'capture_time', 'photo_search_scene'], cover: covers.violet, eventLabel: 'Graduation',
  },
  {
    id: 'memory-farewell-2025', kind: 'photo', title: 'College farewell group photo', fileName: 'farewell-group-2025.jpg',
    path: 'Demo Library/Photos/2025/farewell-group-2025.jpg', date: '2025-03-14', dateField: 'capture_time', uploadDate: '2025-03-15',
    location: 'Demo City University Grounds', camera: 'DemoCamera X1', tags: ['college', 'farewell', 'event'], collectionIds: ['college-life'],
    matchReasons: ['Filename contains farewell', 'Capture date is in 2025', 'Demo OCR evidence mentions graduation'], confidence: 'strong',
    description: 'Synthetic demo photo for a college farewell query.', evidence: ['filename', 'capture_time', 'demo_ocr'], cover: covers.iris, eventLabel: 'College farewell',
  },
  {
    id: 'memory-final-lecture-2025', kind: 'photo', title: 'Final lecture hall moment', fileName: 'final-lecture-2025.jpg',
    path: 'Demo Library/Photos/2025/final-lecture-2025.jpg', date: '2025-03-12', dateField: 'capture_time', uploadDate: '2025-03-13',
    location: 'Demo City University Lecture Hall', camera: 'DemoCamera X1', tags: ['college', 'event'], collectionIds: ['college-life'],
    matchReasons: ['Filename suggests a college event', 'Capture date is in 2025'], confidence: 'possible',
    description: 'Synthetic demo photo with partial event evidence.', evidence: ['filename', 'capture_time'], cover: covers.lilac,
  },
  {
    id: 'memory-presentation-2024', kind: 'photo', title: 'Project presentation', fileName: 'project-presentation-2024.jpg',
    path: 'Demo Library/Photos/2024/project-presentation-2024.jpg', date: '2024-11-08', dateField: 'capture_time', uploadDate: '2024-11-09',
    location: 'Demo University Lab', camera: 'DemoPhone Pro', tags: ['college', 'project'], collectionIds: ['college-life'],
    matchReasons: ['Filename suggests college project work', 'Capture date is in 2024'], confidence: 'possible',
    description: 'Synthetic demo college-life photo.', evidence: ['filename', 'capture_time'], cover: covers.sky,
  },
  {
    id: 'memory-farewell-checklist', kind: 'document', title: 'Farewell committee checklist', fileName: 'farewell-checklist.docx',
    path: 'Demo Library/Documents/farewell-checklist.docx', date: '2025-03-01', dateField: 'modified_time', uploadDate: '2025-03-02',
    location: null, camera: null, documentType: 'docx', pageCount: null, size: '84 KB', tags: ['college', 'farewell', 'document'], collectionIds: ['college-life'],
    matchReasons: ['Filename contains farewell', 'Demo document extraction found checklist items'], confidence: 'possible',
    description: 'Synthetic demo document related to college farewell planning.', evidence: ['filename', 'document_extract'], cover: covers.dawn,
  },
  {
    id: 'memory-college-event-notes', kind: 'document', title: 'College event planning notes', fileName: 'college-event-notes.pdf',
    path: 'Demo Library/Documents/college-event-notes.pdf', date: '2025-02-18', dateField: 'modified_time', uploadDate: '2025-02-19',
    location: null, camera: null, documentType: 'pdf', pageCount: 8, size: '1.2 MB', tags: ['college', 'events', 'document'], collectionIds: ['college-life'],
    matchReasons: ['Filename contains college and event', 'Demo document QA found planning notes'], confidence: 'strong',
    description: 'Synthetic demo document for college event planning.', evidence: ['filename', 'document_qa'], cover: covers.iris,
  },
  {
    id: 'memory-birthday-2025', kind: 'photo', title: 'Birthday celebration', fileName: 'birthday-celebration-2025.jpg',
    path: 'Demo Library/Photos/2025/birthday-celebration-2025.jpg', date: '2025-09-13', dateField: 'capture_time', uploadDate: '2025-09-14',
    location: 'Demo Home Garden', camera: 'DemoPhone Pro', tags: ['family', 'birthday', 'celebration'], collectionIds: ['family-moments', 'celebrations'],
    matchReasons: ['Filename contains birthday', 'Demo OCR evidence mentions celebration'], confidence: 'strong',
    description: 'Synthetic demo photo for a birthday celebration query.', evidence: ['filename', 'demo_ocr'], cover: covers.dawn, eventLabel: 'Birthday',
  },
  {
    id: 'memory-family-dinner-2024', kind: 'photo', title: 'Family dinner', fileName: 'family-dinner-2024.jpg',
    path: 'Demo Library/Photos/2024/family-dinner-2024.jpg', date: '2024-12-25', dateField: 'capture_time', uploadDate: '2024-12-26',
    location: 'Demo Home', camera: 'DemoPhone Pro', tags: ['family', 'holiday', 'dinner'], collectionIds: ['family-moments'],
    matchReasons: ['Filename contains family dinner', 'Capture date is in 2024'], confidence: 'strong',
    description: 'Synthetic demo family gathering photo.', evidence: ['filename', 'capture_time'], cover: covers.lilac,
  },
  {
    id: 'memory-grandparents-2024', kind: 'photo', title: 'Grandparents visit', fileName: 'grandparents-visit-2024.jpg',
    path: 'Demo Library/Photos/2024/grandparents-visit-2024.jpg', date: '2024-08-17', dateField: 'capture_time', uploadDate: '2024-08-18',
    location: 'Demo Family Home', camera: 'DemoCamera X1', tags: ['family', 'visit'], collectionIds: ['family-moments', 'special-occasions'],
    matchReasons: ['Filename contains grandparents', 'Shared family metadata'], confidence: 'possible',
    description: 'Synthetic demo family visit photo.', evidence: ['filename', 'photo_search_scene'], cover: covers.sky,
  },
  {
    id: 'memory-holiday-table-2024', kind: 'photo', title: 'Holiday table', fileName: 'holiday-table-2024.jpg',
    path: 'Demo Library/Photos/2024/holiday-table-2024.jpg', date: '2024-12-24', dateField: 'capture_time', uploadDate: '2024-12-25',
    location: 'Demo Home', camera: 'DemoPhone Pro', tags: ['family', 'holiday'], collectionIds: ['family-moments'],
    matchReasons: ['Filename contains holiday', 'Capture date is in December 2024'], confidence: 'possible',
    description: 'Synthetic demo holiday photo.', evidence: ['filename', 'capture_time'], cover: covers.iris,
  },
  {
    id: 'memory-diwali-lights-2024', kind: 'photo', title: 'Diwali lights at home', fileName: 'diwali-lights-2024.jpg',
    path: 'Demo Library/Photos/2024/diwali-lights-2024.jpg', date: '2024-10-31', dateField: 'capture_time', uploadDate: '2024-11-02',
    location: 'Demo Home', camera: 'DemoPhone Pro', tags: ['festival', 'diwali', 'family'], collectionIds: ['festivals'],
    matchReasons: ['Filename contains Diwali', 'Demo OCR evidence mentions festival lights'], confidence: 'strong',
    description: 'Synthetic demo festival photo.', evidence: ['filename', 'demo_ocr'], cover: covers.violet, eventLabel: 'Diwali',
  },
  {
    id: 'memory-diwali-dinner-2024', kind: 'photo', title: 'Diwali family dinner', fileName: 'diwali-dinner-2024.jpg',
    path: 'Demo Library/Photos/2024/diwali-dinner-2024.jpg', date: '2024-11-01', dateField: 'capture_time', uploadDate: '2024-11-03',
    location: 'Demo Home', camera: 'DemoPhone Pro', tags: ['festival', 'diwali', 'family'], collectionIds: ['festivals', 'family-moments'],
    matchReasons: ['Filename contains Diwali', 'Date is adjacent to the festival period'], confidence: 'possible',
    description: 'Synthetic demo festival dinner photo.', evidence: ['filename', 'capture_time'], cover: covers.dawn,
  },
  {
    id: 'memory-holi-2025', kind: 'photo', title: 'Holi color moment', fileName: 'holi-color-moment-2025.jpg',
    path: 'Demo Library/Photos/2025/holi-color-moment-2025.jpg', date: '2025-03-14', dateField: 'capture_time', uploadDate: '2025-03-15',
    location: 'Demo Community Park', camera: 'DemoPhone Pro', tags: ['festival', 'holi'], collectionIds: ['festivals'],
    matchReasons: ['Filename contains Holi', 'Demo scene evidence suggests festival colors'], confidence: 'strong',
    description: 'Synthetic demo festival photo.', evidence: ['filename', 'photo_search_scene'], cover: covers.sky, eventLabel: 'Holi',
  },
  {
    id: 'memory-christmas-2024', kind: 'photo', title: 'Christmas morning', fileName: 'christmas-morning-2024.jpg',
    path: 'Demo Library/Photos/2024/christmas-morning-2024.jpg', date: '2024-12-25', dateField: 'capture_time', uploadDate: '2024-12-26',
    location: 'Demo Home', camera: 'DemoPhone Pro', tags: ['family', 'holiday', 'christmas'], collectionIds: ['family-moments', 'festivals'],
    matchReasons: ['Filename contains Christmas', 'Capture date matches holiday'], confidence: 'strong',
    description: 'Synthetic demo holiday photo.', evidence: ['filename', 'capture_time'], cover: covers.lilac,
  },
  {
    id: 'memory-beach-vacation-2024', kind: 'photo', title: 'Beach sunset during vacation', fileName: 'beach-sunset-2024.jpg',
    path: 'Demo Library/Photos/2024/beach-sunset-2024.jpg', date: '2024-07-22', dateField: 'capture_time', uploadDate: '2024-07-23',
    location: 'Demo Coast Road', camera: 'DemoPhone Pro', tags: ['travel', 'vacation', 'beach'], collectionIds: ['travel-diaries'],
    matchReasons: ['Filename suggests beach vacation', 'Capture date is in the same trip window'], confidence: 'strong',
    description: 'Synthetic demo travel photo.', evidence: ['filename', 'photo_search_scene'], cover: covers.sky,
  },
  {
    id: 'memory-mountain-overlook-2024', kind: 'photo', title: 'Mountain overlook during vacation', fileName: 'mountain-overlook-vacation.jpg',
    path: 'Demo Library/Photos/2024/mountain-overlook-vacation.jpg', date: '2024-07-19', dateField: 'capture_time', uploadDate: '2024-07-21',
    location: 'Demo Valley Overlook', camera: 'DemoCamera X1', tags: ['travel', 'vacation', 'outdoors'], collectionIds: ['travel-diaries'],
    matchReasons: ['Filename contains vacation', 'Scene metadata suggests travel'], confidence: 'strong',
    description: 'Synthetic demo travel photo.', evidence: ['filename', 'photo_search_scene'], cover: covers.dusk,
  },
  {
    id: 'memory-city-break-2024', kind: 'photo', title: 'City break evening', fileName: 'city-break-evening-2024.jpg',
    path: 'Demo Library/Photos/2024/city-break-evening-2024.jpg', date: '2024-04-11', dateField: 'capture_time', uploadDate: '2024-04-12',
    location: 'Demo Metro City', camera: 'DemoPhone Pro', tags: ['travel', 'city'], collectionIds: ['travel-diaries'],
    matchReasons: ['Filename suggests travel', 'Location metadata is present'], confidence: 'possible',
    description: 'Synthetic demo travel photo.', evidence: ['filename', 'location'], cover: covers.iris,
  },
  {
    id: 'memory-coast-video-2024', kind: 'video', title: 'Vacation clip from the coast', fileName: 'coast-vacation-clip.mp4',
    path: 'Demo Library/Videos/2024/coast-vacation-clip.mp4', date: '2024-07-22', dateField: 'modified_time', uploadDate: '2024-07-24',
    location: null, camera: null, duration: '00:02:14', codec: 'h264', resolution: '1920x1080', size: '148 MB', tags: ['travel', 'vacation', 'video'], collectionIds: ['travel-diaries'],
    matchReasons: ['Filename contains vacation', 'Media metadata reports duration and codec'], confidence: 'possible',
    description: 'Synthetic demo video-file result. No visual-content analysis is claimed.', evidence: ['filename', 'media_info'], cover: covers.sky,
  },
  {
    id: 'memory-roadtrip-video-2024', kind: 'video', title: 'Road trip montage', fileName: 'road-trip-montage.mp4',
    path: 'Demo Library/Videos/2024/road-trip-montage.mp4', date: '2024-07-20', dateField: 'modified_time', uploadDate: '2024-07-21',
    location: null, camera: null, duration: '00:03:42', codec: 'h264', resolution: '3840x2160', size: '620 MB', tags: ['travel', 'video', 'roadtrip'], collectionIds: ['travel-diaries'],
    matchReasons: ['Filename contains road trip', 'Media metadata reports 4K video'], confidence: 'possible',
    description: 'Synthetic demo video-file result.', evidence: ['filename', 'media_info'], cover: covers.dusk,
  },
  {
    id: 'memory-december-walk-2025', kind: 'photo', title: 'December 2025 morning walk', fileName: 'december-walk-2025.jpg',
    path: 'Demo Library/Photos/2025/december-walk-2025.jpg', date: '2025-12-06', dateField: 'capture_time', uploadDate: '2025-12-07',
    location: 'Demo Riverside Path', camera: 'DemoPhone Pro', tags: ['daily', 'winter'], collectionIds: ['special-occasions'],
    matchReasons: ['Capture date is in December 2025'], confidence: 'strong',
    description: 'Synthetic demo photo for a date-based query.', evidence: ['capture_time'], cover: covers.lilac,
  },
  {
    id: 'memory-new-year-2025', kind: 'photo', title: 'New Year evening', fileName: 'new-year-evening-2025.jpg',
    path: 'Demo Library/Photos/2025/new-year-evening-2025.jpg', date: '2025-01-01', dateField: 'capture_time', uploadDate: '2025-01-02',
    location: 'Demo City Skyline', camera: 'DemoPhone Pro', tags: ['holiday', 'new-year'], collectionIds: ['celebrations', 'special-occasions'],
    matchReasons: ['Filename contains New Year', 'Capture date is January 1, 2025'], confidence: 'possible',
    description: 'Synthetic demo celebration photo.', evidence: ['filename', 'capture_time'], cover: covers.violet, eventLabel: 'New Year',
  },
];

export const demoMemories: MemoryItem[] = demoMemoryRecords.map(withDemoPreview);

export const demoCollections: Collection[] = [
  {
    id: 'college-life', title: 'College Life', description: 'Classes, projects, farewells, and graduation moments.',
    suggestedAlbumName: 'College Life 2025', memberIds: ['memory-graduation-2025', 'memory-farewell-2025', 'memory-final-lecture-2025', 'memory-presentation-2024', 'memory-farewell-checklist', 'memory-college-event-notes'],
    lastUpdated: '2025-05-24', evidence: 'Demo tags and filenames mention college, graduation, farewell, and events.', requiresConfirmation: true, canCreateInDemo: false, cover: covers.violet,
  },
  {
    id: 'family-moments', title: 'Family Moments', description: 'Gatherings, birthdays, holidays, and visits.',
    suggestedAlbumName: 'Family Moments', memberIds: ['memory-birthday-2025', 'memory-family-dinner-2024', 'memory-grandparents-2024', 'memory-holiday-table-2024', 'memory-christmas-2024'],
    lastUpdated: '2025-09-13', evidence: 'Demo tags mention family, birthday, holiday, and visit moments.', requiresConfirmation: true, canCreateInDemo: false, cover: covers.dawn,
  },
  {
    id: 'festivals', title: 'Festivals', description: 'Diwali, Holi, Christmas, and celebration memories.',
    suggestedAlbumName: 'Festival Memories', memberIds: ['memory-diwali-lights-2024', 'memory-diwali-dinner-2024', 'memory-holi-2025', 'memory-christmas-2024'],
    lastUpdated: '2025-03-14', evidence: 'Demo filenames and tags mention Diwali, Holi, and Christmas.', requiresConfirmation: true, canCreateInDemo: false, cover: covers.iris,
  },
  {
    id: 'travel-diaries', title: 'Travel Diaries', description: 'Vacations, road trips, beaches, mountains, and city breaks.',
    suggestedAlbumName: 'Travel Diaries 2024', memberIds: ['memory-beach-vacation-2024', 'memory-mountain-overlook-2024', 'memory-city-break-2024', 'memory-coast-video-2024', 'memory-roadtrip-video-2024'],
    lastUpdated: '2024-07-24', evidence: 'Demo filenames, tags, and media metadata suggest travel memories.', requiresConfirmation: true, canCreateInDemo: false, cover: covers.sky,
  },
  {
    id: 'celebrations', title: 'Celebrations', description: 'Birthdays, graduations, holidays, and milestones.',
    suggestedAlbumName: 'Celebrations', memberIds: ['memory-graduation-2025', 'memory-birthday-2025', 'memory-christmas-2024', 'memory-new-year-2025'],
    lastUpdated: '2025-09-13', evidence: 'Demo evidence includes graduation, birthday, and holiday events.', requiresConfirmation: true, canCreateInDemo: false, cover: covers.lilac,
  },
  {
    id: 'special-occasions', title: 'Special Occasions', description: 'Visits, seasonal moments, and personally meaningful dates.',
    suggestedAlbumName: 'Special Occasions', memberIds: ['memory-grandparents-2024', 'memory-december-walk-2025', 'memory-new-year-2025'],
    lastUpdated: '2025-12-06', evidence: 'Demo metadata groups visits and seasonal milestones.', requiresConfirmation: true, canCreateInDemo: false, cover: covers.dusk,
  },
];

export function getDemoMemoriesByIds(ids: string[] = []) {
  return demoMemories.filter((item) => ids.includes(item.id));
}
