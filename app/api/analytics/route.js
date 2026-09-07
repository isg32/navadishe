// Powers the dashboard's Summary screen. Scope depends on role:
// admin sees everything, reader sees only their assigned districts, poc
// sees only what they personally submitted (they have no district scope
// and no list access at all).
import { getSession, jsonResponse } from '@/lib/session';
import { db } from '@/lib/db';

export async function GET(request) {
  const session = await getSession(request);
  if (!session) {
    return jsonResponse({ result: 'error', error: 'Not authenticated' }, 401);
  }

  const sql = db();
  const { role, u: username, districts } = session;

  try {
    if (role === 'poc') {
      const scope = sql`and created_by = ${username}`;
      const [
        [{ c: schools }],
        [{ strength, participated }],
        [cls],
        [today],
        recent,
      ] = await Promise.all([
        sql`select count(*)::int as c from school_registrations where true ${scope}`,
        sql`select
              coalesce(sum(coalesce(students_1_9,0)+coalesce(students_10,0)+coalesce(students_11,0)+coalesce(students_12,0)),0)::int as strength,
              coalesce(sum(coalesce(students_10,0)+coalesce(students_11,0)+coalesce(students_12,0)),0)::int as participated
            from school_registrations where true ${scope}`,
        sql`select
              coalesce(sum(students_1_9),0)::int as c1_9,
              coalesce(sum(students_10),0)::int as c10,
              coalesce(sum(students_11),0)::int as c11,
              coalesce(sum(students_12),0)::int as c12
            from school_registrations where true ${scope}`,
        sql`select
              count(*)::int as registrations,
              coalesce(sum(coalesce(students_1_9,0)+coalesce(students_10,0)+coalesce(students_11,0)+coalesce(students_12,0)),0)::int as strength,
              coalesce(sum(coalesce(students_10,0)+coalesce(students_11,0)+coalesce(students_12,0)),0)::int as participated
            from school_registrations where created_at >= date_trunc('day', now()) ${scope}`,
        sql`select created_at, code, school_name, district, board from school_registrations where true ${scope} order by created_at desc limit 8`,
      ]);
      return jsonResponse({
        result: 'success',
        scope: 'own',
        totals: { schools, strength, participated },
        classBreakdown: cls,
        today,
        recentRegistrations: recent,
      });
    }

    const scopedDistricts = role === 'reader' ? (districts || []) : null;
    if (scopedDistricts && scopedDistricts.length === 0) {
      return jsonResponse({
        result: 'success',
        scope: 'districts',
        totals: { schools: 0, strength: 0, participated: 0, websiteLeads: 0, callbackRequests: 0, districts: 0 },
        classBreakdown: { c1_9: 0, c10: 0, c11: 0, c12: 0 },
        today: { registrations: 0, strength: 0, participated: 0 },
        boardBreakdown: [],
        districtBreakdown: [],
        recentRegistrations: [],
        recentLeads: [],
      });
    }

    // AND-clause fragment, safe to splice into "where true <fragment>" —
    // empty when unscoped (admin), "and district = any(...)" when scoped.
    const distFilter = scopedDistricts ? sql`and district = any(${scopedDistricts})` : sql``;

    const [
      [{ c: schools }],
      [{ c: websiteLeads }],
      [{ c: callbackRequests }],
      [{ c: districtCount }],
      [{ strength, participated }],
      [cls],
      [today],
      boardBreakdown,
      districtBreakdown,
      recentRegistrations,
      recentLeads,
    ] = await Promise.all([
      sql`select count(*)::int as c from school_registrations where true ${distFilter}`,
      sql`select count(*)::int as c from website_leads where true ${distFilter}`,
      sql`select count(*)::int as c from website_leads where request_callback ${distFilter}`,
      sql`select count(distinct district)::int as c from school_registrations where district is not null and district <> '' ${distFilter}`,
      sql`select
            coalesce(sum(coalesce(students_1_9,0)+coalesce(students_10,0)+coalesce(students_11,0)+coalesce(students_12,0)),0)::int as strength,
            coalesce(sum(coalesce(students_10,0)+coalesce(students_11,0)+coalesce(students_12,0)),0)::int as participated
          from school_registrations where true ${distFilter}`,
      sql`select
            coalesce(sum(students_1_9),0)::int as c1_9,
            coalesce(sum(students_10),0)::int as c10,
            coalesce(sum(students_11),0)::int as c11,
            coalesce(sum(students_12),0)::int as c12
          from school_registrations where true ${distFilter}`,
      sql`select
            count(*)::int as registrations,
            coalesce(sum(coalesce(students_1_9,0)+coalesce(students_10,0)+coalesce(students_11,0)+coalesce(students_12,0)),0)::int as strength,
            coalesce(sum(coalesce(students_10,0)+coalesce(students_11,0)+coalesce(students_12,0)),0)::int as participated
          from school_registrations where created_at >= date_trunc('day', now()) ${distFilter}`,
      sql`select board, count(*)::int as count from school_registrations where board is not null and board <> '' ${distFilter} group by board order by count desc`,
      sql`select district, count(*)::int as count from school_registrations where district is not null and district <> '' ${distFilter} group by district order by count desc limit 10`,
      sql`select created_at, code, school_name, district, board, created_by from school_registrations where true ${distFilter} order by created_at desc limit 8`,
      sql`select created_at, name, district, phone, request_callback from website_leads where true ${distFilter} order by created_at desc limit 8`,
    ]);

    return jsonResponse({
      result: 'success',
      scope: scopedDistricts ? 'districts' : 'all',
      totals: {
        schools,
        strength,
        participated,
        websiteLeads,
        callbackRequests,
        districts: districtCount,
      },
      classBreakdown: cls,
      today,
      boardBreakdown,
      districtBreakdown,
      recentRegistrations,
      recentLeads,
    });
  } catch (err) {
    return jsonResponse({ result: 'error', error: String(err) }, 500);
  }
}
