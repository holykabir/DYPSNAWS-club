import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import supabaseAdmin from "@/lib/supabaseAdmin";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status");

  let query = supabaseAdmin
    .from("quizzes")
    .select("*")
    .order("created_at", { ascending: false });

  if (status) {
    query = query.eq("status", status);
  }

  const { data, error } = await query;

  if (error) {
    console.error("Error fetching quizzes:", error);
    return NextResponse.json([]);
  }

  // For each quiz, get question count and attempt count
  const quizzes = await Promise.all(
    (data || []).map(async (q) => {
      const { count: questionCount } = await supabaseAdmin
        .from("quiz_questions")
        .select("*", { count: "exact", head: true })
        .eq("quiz_id", q.id);

      const { count: attemptCount } = await supabaseAdmin
        .from("quiz_attempts")
        .select("*", { count: "exact", head: true })
        .eq("quiz_id", q.id)
        .eq("completed", true);

      return {
        id: q.id,
        title: q.title,
        description: q.description,
        status: q.status,
        timeLimitSeconds: q.time_limit_seconds,
        color: q.color,
        createdAt: q.created_at,
        startedAt: q.started_at,
        endedAt: q.ended_at,
        questionCount: questionCount || 0,
        attemptCount: attemptCount || 0,
      };
    })
  );

  return NextResponse.json(quizzes);
}

export async function POST(request) {
  const admin = await requireAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();

    const row = {
      title: body.title,
      description: body.description || "",
      status: "draft",
      time_limit_seconds: body.timeLimitSeconds || 30,
      color: body.color || "#A855F7",
    };

    const { data: quiz, error } = await supabaseAdmin
      .from("quizzes")
      .insert(row)
      .select()
      .single();

    if (error) {
      console.error("Error creating quiz:", error);
      return NextResponse.json({ error: "Failed to create quiz" }, { status: 500 });
    }

    // Insert questions if provided
    if (body.questions && body.questions.length > 0) {
      const questionRows = body.questions.map((q, i) => ({
        quiz_id: quiz.id,
        question: q.question,
        options: q.options,
        correct_index: q.correctIndex,
        points: q.points || 10,
        order_num: i,
      }));

      const { error: qError } = await supabaseAdmin
        .from("quiz_questions")
        .insert(questionRows);

      if (qError) {
        console.error("Error creating questions:", qError);
      }
    }

    return NextResponse.json({ id: quiz.id, ...row }, { status: 201 });
  } catch (err) {
    console.error("Error creating quiz:", err);
    return NextResponse.json({ error: "Failed to create quiz" }, { status: 500 });
  }
}
