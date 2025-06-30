export interface Course {
  id: string;
  title: string;
  slug: string;
  type: string;
  duration: string;
  price_offer: string;
  price_regular: string;
  poster: string;
  description: string;
  starts_on: string;
  is_published: boolean;
}

export interface Lesson {
	id: string;
	title: string;
	position: number;
	duration_minutes?: number;
	is_live_session?: boolean;
	live_start_time?: string;
}

export interface Module {
	id: string;
	title: string;
	position: number;
	description?: string;
	lessons: Lesson[];
}

export interface CourseModulesProps {
	modules: Module[];
}

export interface TopicsProps {
  topics: string[];
}

export interface HeroRecordedProps {
  title: string;
  description: string;
  poster: string;
  enrollLink: string;
  startsOn?: string;
}

export interface CourseEnrollCardProps {
	course: {
		id: string;
		title: string;
		poster: string;
		price_regular?: number;
		price_offer?: number;
		duration?: string;
		enroll_link?: string;
		included?: string[];
		starts_on?: string;
		slug: string;
	};
}

export interface UserCourse {
	enrolled_at: string;
	progress: number;
	completed: boolean;
	course_id: string;
}

export interface ExamRecord {
	examId: string
	examName: string
	score: number
	position: number
	totalParticipants: number
	attendedAt: string
}

export interface CourseExamTableProps {
  courseId: string
}

export interface FAQ {
	question: string;
	answer: string;
}

export interface FAQSectionProps {
	faqs: FAQ[];
}
