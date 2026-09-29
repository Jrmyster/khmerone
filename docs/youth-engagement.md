# KhmerOne youth engagement architecture

## Product promise

Help a young person make something useful in a short session, see their own progress, and find a plausible local collaboration path. The interface addresses learners with respect and never labels them as “at-risk.” Small, achievable tasks come before status rewards.

## Homepage flow

1. The hero offers **Unlock Your Power / ពង្រឹងសមត្ថភាពរបស់អ្នក** and a direct route to the app directory.
2. Fast-Track Power Skills shows four practical pathways with three self-reported steps each. Every card names an outcome and a concrete first action.
3. Status & Clout shows private Cyber-XP, a signal level, and earned badges. There is no public leaderboard.
4. Find Your Crew filters proposed project circles by province and skill. Saving interest stays on the device; the site does not collect contacts or imply live membership.
5. The existing app directory remains searchable and bilingual. Opening a linked app counts as one exploration event.

## Progress rules

| Event | Cyber-XP | Limit |
| --- | ---: | --- |
| Open a distinct learning app | 10 | Once per app |
| Mark a practical step complete | 20 | Per step; unchecking removes it |
| Finish all three steps in a pathway | 50 | Once per completed pathway; reversible |

Every 120 XP raises the personal signal level. **Digital Apprentice** unlocks after a first exploration or step. **Code Runner** unlocks after the Web & App Basics pathway. **Community Pioneer** unlocks after finishing one pathway and saving a crew interest. These describe observable in-product actions, not externally verified skill or community service.

Progress is stored under `khmerone-cyber-progress-v1` in browser local storage. The score is derived from validated IDs rather than stored separately. It is an offline-friendly personal draft, not an account, credential, certificate, or cross-device record. A later authenticated version can sync event records with consent and merge by stable app/step IDs.

## Crew directory state

The four province cards are **concepts**, each with a possible project. No member counts, personal profiles, public chat, or meeting locations are shown. A future live guild service should provide verified facilitators, moderated project spaces, reporting and blocking, age-appropriate access, minimal profile data, and clear consent before members can contact one another. Publication of a real group requires a confirmed organizer and a safe contact workflow.

## Messaging framework

| Moment | English | Khmer |
| --- | --- | --- |
| Hero | Build skills. Shape your future. | បង្កើនជំនាញ។ បង្កើតអនាគតរបស់អ្នក។ |
| Main action | Unlock Your Power | ពង្រឹងសមត្ថភាពរបស់អ្នក |
| Progress ping | Go at your pace. Every useful step counts. | រៀនតាមល្បឿនរបស់អ្នក។ គ្រប់ជំហានមានតម្លៃ។ |
| Crew invitation | Build with people near you. | បង្កើតអ្វីថ្មីជាមួយមនុស្សនៅក្បែរអ្នក។ |

The copy emphasizes agency and useful work. Badges are quiet acknowledgments; they do not compare learners or pressure them to maintain streaks.

## Code map

- `data/engagement.ts`: localized pathways, steps, and crew concepts.
- `hooks/useCyberProgress.ts`: persistence, validation, XP, levels, and badge logic.
- `components/PowerSkillsDashboard.tsx`: gamified progress and skill cards.
- `components/CrewDirectory.tsx`: province and interest filters with local interest selection.
- `app/page.tsx`: hero actions, resource exploration events, and section integration.
- `app/globals.css`: responsive cyberpunk presentation.
