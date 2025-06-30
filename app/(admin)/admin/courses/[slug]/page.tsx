"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Button } from "@/components/ui/Button";
import { Switch } from "@/components/ui/Switch";
import toast, { Toaster } from "react-hot-toast";

interface Lesson {
  id?: string;
  title: string;
  position: number;
  notes: string;
  video_url: string;
  is_live_session: boolean;
  live_start_time: string;
  duration_minutes: number;
  module_id?: string;
}

interface Module {
  id?: string;
  title: string;
  position: number;
  description: string;
  course_id?: string;
  lessons: Lesson[];
}

interface CourseForm {
  id: string;
  title: string;
  slug: string;
  duration: string;
  price_regular: string;
  price_offer: string;
  poster: string;
  og_image: string;
  enroll_link: string;
  certificate: string;
  type: 'live' | 'recorded' | 'hybrid';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  starts_on: string;
  is_published: boolean;
  description: string;
  included: string[];
  for_whom: string[];
  requirements: string[];
  topics: string[];
}

type ArrayFieldName = 'included' | 'for_whom' | 'requirements' | 'topics';

interface FormField {
  name: keyof CourseForm;
  label: string;
  type?: 'text' | 'number' | 'checkbox';
  value?: string | number;
}

export default function EditCoursePage() {
  const { slug } = useParams();
  const router = useRouter();
  const supabase = createClientComponentClient();

  const [modules, setModules] = useState<Module[]>([]);
  const [form, setForm] = useState<CourseForm | null>(null);
  const [loading, setLoading] = useState(true);

  const formFields: FormField[] = [
    { name: "title", label: "Course Title" },
    { name: "slug", label: "Slug" },
    { name: "duration", label: "Duration" },
    { name: "price_regular", label: "Regular Price", type: "number" },
    { name: "price_offer", label: "Offer Price", type: "number" },
    { name: "poster", label: "Poster Image URL" },
    { name: "og_image", label: "OG Image URL" },
    { name: "enroll_link", label: "Enroll Link" },
    { name: "certificate", label: "Certificate" },
  ];

  const defaultLesson = (): Lesson => ({
    title: "",
    position: 1,
    notes: "",
    video_url: "",
    is_live_session: false,
    live_start_time: "",
    duration_minutes: 0,
  });

  const defaultModule = (): Module => ({
    title: "",
    position: modules.length + 1,
    description: "",
    lessons: [defaultLesson()],
  });

  useEffect(() => {
    if (!slug) return;

    const fetchData = async () => {
      const { data, error } = await supabase
        .from("courses")
        .select("*")
        .eq("slug", slug)
        .single();

      if (error || !data) {
        console.error("Error fetching course:", error);
        toast.error("Error fetching course");
        return router.push("/admin/courses");
      }

      setForm({
        ...data,
        included: data.included || [""],
        for_whom: data.for_whom || [""],
        requirements: data.requirements?.split(",") || [""],
        topics: data.topics || [""],
        starts_on: data.starts_on?.split("T")[0] || "",
      });

      const { data: mods, error: modErr } = await supabase
        .from("modules")
        .select("*, lessons(*)")
        .eq("course_id", data.id)
        .order("position", { ascending: true });

      if (modErr) {
        console.error("Error fetching modules:", modErr);
        toast.error("Error fetching modules");
      }

      setModules(
        (mods || []).map((mod) => ({
          ...mod,
          lessons: (mod.lessons || []).map((lesson: Lesson) => ({ ...lesson })),
        }))
      );

      setLoading(false);
    };

    fetchData();
  }, [slug, router, supabase]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    
    setForm((prev) => {
      if (!prev) return null;
      
      // Handle numeric fields
      if (name === 'price_regular' || name === 'price_offer') {
        return {
          ...prev,
          [name]: value
        };
      }
      
      return {
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      };
    });
  };

  const handleArrayChange = (name: ArrayFieldName, idx: number, value: string) => {
    if (!form) return;
    const arr = [...form[name]];
    arr[idx] = value;
    setForm((prev) => prev ? { ...prev, [name]: arr } : null);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!form) return;

    const updateData = {
      ...form,
      included: form.included,
      for_whom: form.for_whom,
      requirements: form.requirements.join(","),
      topics: form.topics,
      starts_on: form.starts_on || null,
      price_regular: Number(form.price_regular),
      price_offer: Number(form.price_offer),
    };

    const { error } = await supabase
      .from("courses")
      .update(updateData)
      .eq("id", form.id);

    if (error) {
      console.error(error);
      toast.error("Update failed");
    } else {
      toast.success("Course updated!");
      router.push("/admin/courses");
    }

    for (const moduleData of modules) {
      let moduleId = moduleData.id;

      if (moduleId) {
        await supabase.from("modules").update({
          title: moduleData.title,
          description: moduleData.description,
          position: moduleData.position,
        }).eq("id", moduleId);
      } else {
        const { data: mod } = await supabase
          .from("modules")
          .insert({
            course_id: form.id,
            title: moduleData.title,
            description: moduleData.description,
            position: moduleData.position,
          })
          .select()
          .single();
        moduleId = mod?.id;
      }

      for (const lesson of moduleData.lessons) {
        if (lesson.id) {
          await supabase.from("lessons").update(lesson).eq("id", lesson.id);
        } else {
          await supabase.from("lessons").insert({
            ...lesson,
            module_id: moduleId,
          });
        }
      }
    }
  };

  const getInputValue = (field: FormField, form: CourseForm | null): string => {
    if (!form) return "";
    const value = form[field.name];
    if (value === undefined) return "";
    return String(value);
  };

  if (loading || !form) return <p className="p-6">লোড হচ্ছে...</p>;

  return (
    <div className="max-w-5xl mx-auto py-12 px-4">
			<Toaster />
      <h1 className="text-3xl font-bold mb-8">Edit Course: {form.title}</h1>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {formFields.map((f) => (
          <div key={f.name}>
            <label className="block text-sm font-medium text-gray-700">{f.label}</label>
            <input
              name={f.name}
              type={f.type || "text"}
              className="bg-white"
              value={getInputValue(f, form)}
              onChange={handleChange}
            />
          </div>
        ))}

        <div>
          <label className="block text-sm font-medium text-gray-700">Course Type</label>
          <select name="type" value={form.type} onChange={handleChange} className="w-full border rounded-lg px-3 py-2">
            {["live","recorded","hybrid"].map(val => (
              <option key={val} value={val}>{val}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Difficulty</label>
          <select name="difficulty" value={form.difficulty} onChange={handleChange} className="w-full border rounded-lg px-3 py-2">
            {["beginner","intermediate","advanced"].map(val => (
              <option key={val} value={val}>{val}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Start Date</label>
          <input type="date" name="starts_on" className="bg-white" value={form.starts_on} onChange={handleChange} />
        </div>

        <div className="flex items-center space-x-3">
          <Switch id="is_published" checked={form.is_published} onCheckedChange={(val: boolean) => setForm((prev) => prev ? { ...prev, is_published: val } : null)} />
          <label className="block text-sm font-medium text-gray-700">Publish Course?</label>
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700">Description</label>
          <textarea name="description" className="bg-white" value={form.description} rows={5} onChange={handleChange} />
        </div>

        {(['for_whom', 'included', 'requirements', 'topics'] as ArrayFieldName[]).map((name) => (
          <div key={name} className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700">{name === "for_whom" ? "Who is this for?" : name}</label>
            {form[name].map((val, idx) => (
              <div key={idx} className="flex gap-2 mb-2">
                <input 
                  value={val} 
                  className="bg-white" 
                  onChange={e => handleArrayChange(name, idx, e.target.value)} 
                />
                <Button type="button" onClick={() => {
                  const arr = [...form[name]];
                  arr.splice(idx, 1);
                  setForm((prev) => prev ? { ...prev, [name]: arr } : null);
                }}>-</Button>
              </div>
            ))}
            <Button type="button" onClick={() => {
              const arr = [...form[name]];
              arr.push("");
              setForm((prev) => prev ? { ...prev, [name]: arr } : null);
            }}>+ Add</Button>
          </div>
        ))}

        <div className="md:col-span-2 mt-8 bg-white p-4 rounded-md">
					<h2 className="text-xl font-bold mb-4">Modules & Lessons</h2>

					{modules.map((module, modIndex) => (
						<div key={modIndex} className="border border-gray-300 rounded-md p-4 mb-6">
							<div className="mb-2">
								<label className="block text-sm font-medium text-gray-700">Module Title</label>
									<input
									className="bg-white"
									value={module.title}
									onChange={(e) => {
										const updated = [...modules];
										updated[modIndex].title = e.target.value;
										setModules(updated);
									}}
								/>
							</div>
							<div className="mb-2">
								<label className="block text-sm font-medium text-gray-700">Module Description</label>
								<textarea
									className="bg-white"
									value={module.description || ""}
									onChange={(e) => {
										const updated = [...modules];
										updated[modIndex].description = e.target.value;
										setModules(updated);
									}}
								/>
							</div>

							{module.lessons.map((lesson: Lesson, lessonIndex: number) => (
								<div key={lessonIndex} className="border-l-4 border-purple-500 pl-4 my-4">
									<label className="block text-sm font-medium text-gray-700">Lesson Title</label>
									<input
										className="bg-white"
										value={lesson.title}
										onChange={(e) => {
											const updated = [...modules];
											updated[modIndex].lessons[lessonIndex].title = e.target.value;
											setModules(updated);
										}}
									/>
									<label className="block text-sm font-medium text-gray-700">Notes</label>
									<textarea
										className="bg-white"
										value={lesson.notes || ""}
										onChange={(e) => {
											const updated = [...modules];
											updated[modIndex].lessons[lessonIndex].notes = e.target.value;
											setModules(updated);
										}}
									/>
									<label className="block text-sm font-medium text-gray-700">Video URL</label>
									<input
										className="bg-white"
										value={lesson.video_url || ""}
										onChange={(e) => {
											const updated = [...modules];
											updated[modIndex].lessons[lessonIndex].video_url = e.target.value;
											setModules(updated);
										}}
									/>
									<div className="flex items-center space-x-2 mt-2">
										<Switch
											checked={lesson.is_live_session}
											onCheckedChange={(val) => {
												const updated = [...modules];
												updated[modIndex].lessons[lessonIndex].is_live_session = val;
												setModules(updated);
											}}
										/>
										<label className="block text-sm font-medium text-gray-700">Is Live Session?</label>
									</div>
									{lesson.is_live_session && (
										<>
											<label className="block text-sm font-medium text-gray-700">Live Start Time</label>
											<input
												className="bg-white"
												type="datetime-local"
												value={lesson.live_start_time || ""}
												onChange={(e) => {
													const updated = [...modules];
													updated[modIndex].lessons[lessonIndex].live_start_time = e.target.value;
													setModules(updated);
												}}
											/>
											<label className="block text-sm font-medium text-gray-700">Duration (minutes)</label>
											<input
												className="bg-white"
												type="number"
												value={lesson.duration_minutes}
												onChange={(e) => {
													const updated = [...modules];
													updated[modIndex].lessons[lessonIndex].duration_minutes = Number(e.target.value);
													setModules(updated);
												}}
											/>
										</>
									)}
									<Button
										variant="default"
										type="button"
										className="mt-2 bg-red-500 text-white"
										onClick={() => {
											const updated = [...modules];
											updated[modIndex].lessons.splice(lessonIndex, 1);
											setModules(updated);
										}}
									>
										Remove Lesson
									</Button>
								</div>
							))}

							<Button
								type="button"
								onClick={() => {
									const updated = [...modules];
									updated[modIndex].lessons.push(defaultLesson());
									setModules(updated);
								}}
							>
								+ Add Lesson
							</Button>

							<Button
								type="button"
								variant="default"
								className="ml-4 bg-red-500 text-white"
								onClick={() => {
									const updated = [...modules];
									updated.splice(modIndex, 1);
									setModules(updated);
								}}
							>
								Remove Module
							</Button>
						</div>
					))}

					<Button
						type="button"
						className="mt-2"
						onClick={() => setModules([...modules, defaultModule()])}
					>
						+ Add Module
					</Button>
				</div>

        <Button type="submit" className="md:col-span-2 mt-6">Save Changes</Button>
      </form>
    </div>
  );
}
