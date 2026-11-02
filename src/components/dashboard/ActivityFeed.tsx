import React from 'react';
import { ActivityIcon } from 'lucide-react';
import type { Activity } from '../../types/models';
import { relativeTime } from '../../utils/format';
import { MODULE_LABELS } from '../../utils/permissions';
import { EmptyState } from '../ui/EmptyState';

export function ActivityFeed({ activities }: {activities: Activity[];}) {
  return (
    <section className="rounded-2xl border border-edge bg-charcoal" aria-labelledby="recent-activity">
      <header className="px-5 pt-5">
        <h2 id="recent-activity" className="text-sm font-semibold text-fg">Recent activity</h2>
      </header>
      {activities.length === 0 ?
      <EmptyState icon={ActivityIcon} title="No activity yet" /> :

      <ol className="relative mx-5 my-4 border-l border-edge">
          {activities.slice(0, 8).map((a) =>
        <li key={a.id} className="relative pb-4 pl-5 last:pb-0">
              <span className="absolute -left-[4.5px] top-1.5 h-2 w-2 rounded-full bg-gold" aria-hidden="true" />
              <p className="text-sm text-fg">{a.message}</p>
              <p className="mt-0.5 text-xs text-subtle">
                {MODULE_LABELS[a.module]} · {a.by} · {relativeTime(a.at)}
              </p>
            </li>
        )}
        </ol>
      }
    </section>);

}