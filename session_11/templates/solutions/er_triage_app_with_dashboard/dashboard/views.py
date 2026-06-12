"""Dashboard app — Lesson 6's worked example.

A single read-only page that answers "what does the queue look like right now?":
how many patients at each acuity level, and how many have an oncologic-emergency
flag. It reuses the existing TriageEvent model from the `triage` app — no new
database table, no new form. That is the whole point of the lesson: a new Django
app that *reads* the data the triage app already collects.
"""
from collections import Counter

from django.db.models import Count
from django.shortcuts import render

from triage.models import TriageEvent


def dashboard_view(request):
    events = TriageEvent.objects.all()
    total = events.count()

    # Count events per acuity level (1..5), filling in zeros for empty levels.
    by_acuity_raw = dict(
        events.values_list("acuity").annotate(n=Count("id")).values_list("acuity", "n")
    )
    by_acuity = [{"acuity": a, "count": by_acuity_raw.get(a, 0)} for a in range(1, 6)]

    # Count each oncologic-emergency flag across all events.
    flag_counter = Counter()
    for flags in events.values_list("oncologic_emergency_flags", flat=True):
        flag_counter.update(flags or [])

    context = {
        "total": total,
        "by_acuity": by_acuity,
        "emergencies": sorted(flag_counter.items(), key=lambda kv: -kv[1]),
        "emergency_total": sum(flag_counter.values()),
        "max_count": max([row["count"] for row in by_acuity] + [1]),
    }
    return render(request, "dashboard/dashboard.html", context)
