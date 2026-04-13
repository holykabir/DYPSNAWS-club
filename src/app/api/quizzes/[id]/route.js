import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import supabaseAdmin from "@/lib/supabaseAdmin";

export async function GET(request, { params }) {
  const { id } = await params;

  const { data: quiz, error } = await supabaseAdmin
    .from("quizzes")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !quiz) {
    return NextResponse.json({ error: "Quiz not found" }, { status: 404 });
  }

  // Get questions
  const { data: questions } = await supabaseAdmin
    .from("quiz_questions")
    .select("*")
    .eq("quiz_id", id)
    .order("order_num", { ascending: true });

  return NextResponse.json({
    id: quiz.id,
    title: quiz.title,
    description: quiz.description,
    status: quiz.status,
    timeLimitSeconds: quiz.time_limit_seconds,
    color: quiz.color,
    createdAt: quiz.created_at,
    startedAt: quiz.started_at,
    endedAt: quiz.ended_at,
    questions: (questions || []).map((q) => ({
      id: q.id,
      question: q.question,
      options: q.options,
      correctIndex: q.correct_index,
      points: q.points,
      orderNum: q.order_num,
    })),
  });
}

export async function PUT(request, { params }) {
  const admin = await requireAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;
    const body = await request.json();

    const row = {};
    if (body.title !== undefined) row.title = body.title;
    if (body.description !== undefined) row.description = body.description;
    if (body.timeLimitSeconds !== undefined) row.time_limit_seconds = body.timeLimitSeconds;
    if (body.color !== undefined) row.color = body.color;

    // Handle status changes
    if (body.status !== undefined) {
      row.status = body.status;
      if (body.status === "live") {
        row.started_at = new Date().toISOString();
        row.ended_at = null;
      } else if (body.status === "ended") {
        row.ended_at = new Date().toISOString();
      }
    }

    const { data: quiz, error } = await supabaseAdmin
      .from("quizzes")
      .update(row)
      .eq("id", id)
      .select()
      .single();

    if (error || !quiz) {
      return NextResponse.json({ error: "Quiz not found" }, { status: 404 });
    }

    // Update questions if provided
    if (body.questions !== undefined) {
      // Delete old questions
      await supabaseAdmin
        .from("quiz_questions")
        .delete()
        .eq("quiz_id", id);

      // Insert new questions
      if (body.questions.length > 0) {
        const questionRows = body.questions.map((q, i) => ({
          quiz_id: id,
          question: q.question,
          options: q.options,
          correct_index: q.correctIndex,
          points: q.points || 10,
          order_num: i,
        }));

        await supabaseAdmin.from("quiz_questions").insert(questionRows);
      }
    }

    return NextResponse.json({
      id: quiz.id,
      title: quiz.title,
      description: quiz.description,
      status: quiz.status,
      timeLimitSeconds: quiz.time_limit_seconds,
      color: quiz.color,
    });
  } catch (err) {
    console.error("Error updating quiz:", err);
    return NextResponse.json({ error: "Failed to update quiz" }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  const admin = await requireAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;

    const { error } = await supabaseAdmin
      .from("quizzes")
      .delete()
      .eq("id", id);

    if (error) {
      return NextResponse.json({ error: "Failed to delete quiz" }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: "Failed to delete quiz" }, { status: 500 });
  }
}
