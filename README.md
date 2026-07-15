# NeighbourlyLuxembourg

# Inspiration

Luxembourg has one of the highest proportions of older adults living independently in Europe. While many seniors value their independence, everyday tasks such as grocery shopping, collecting prescriptions, or simply having someone to talk to can become increasingly difficult. At the same time, many people in local communities genuinely want to help but have no simple way of connecting with those who need assistance.

Neighbourly Luxembourg was inspired by the idea that technology should strengthen communities rather than replace human interaction. We wanted to create a platform that makes it easy for volunteers and seniors to find one another, coordinate help, and build meaningful local connections.

# What it does

Neighbourly Luxembourg is a community platform that connects seniors with trusted volunteers in their local area.

Seniors can request help for everyday tasks such as:
- Grocery shopping
- Picking up prescriptions
- Small household assistance
- Transportation
- Friendly visits and companionship

Volunteers can browse requests, offer assistance, and communicate with seniors through a simple and accessible interface.

The goal is to reduce loneliness, support independent living, and strengthen neighbourhood communities across Luxembourg.

## Accounts and persistent data

Neighbourly has separate secure accounts for helpers and help finders. Accounts are stored in Supabase Auth and their profiles are stored in the Supabase PostgreSQL database, so they remain available after a browser or server restart.

### Production setup

1. Create a Supabase project.
2. In its SQL Editor, run the migrations in `supabase/migrations/0001_init.sql` and then `supabase/migrations/0002_auth_accounts.sql`.
3. In Supabase Authentication → URL Configuration, set the Site URL to your Vercel domain and add these redirect URLs:
   - `https://your-domain.vercel.app/login-helper`
   - `https://your-domain.vercel.app/login-help-finder`
4. In Vercel → Project → Settings → Environment Variables, add the two values in `.env.example` from Supabase → Project Settings → API.
5. Redeploy. New accounts will then persist securely. Helpers start as `pending` and must be marked `verified` before appearing in the public directory.

# How we built it

We started by identifying the core problem instead of immediately thinking about technology. We mapped out the experience from the perspective of both seniors and volunteers and focused on keeping the workflow as simple as possible.

The project was rapidly prototyped through iterative development. We refined the interface based on usability, prioritising accessibility, clear navigation, and minimal complexity so that the platform remains approachable for users with varying levels of digital experience.

Throughout development, we continuously improved the product by testing ideas, simplifying interactions, and removing unnecessary friction.

# Challenges we ran into

One of the biggest challenges was designing for users who may not be comfortable with technology. Features that seem intuitive to younger users often become confusing for older adults.

Another challenge was balancing simplicity with functionality. We wanted the platform to be useful without overwhelming users with unnecessary options.

We also spent considerable time thinking about trust and safety, since any platform connecting strangers in real life must encourage confidence and responsible community interactions.

# Accomplishments that we're proud of

We're proud of creating a project that addresses a genuine social issue rather than solving a purely technical problem.

Instead of building technology for its own sake, we focused on creating something that could positively impact local communities by helping seniors remain independent while making volunteering more accessible.

We're also proud of taking an idea from concept to a working prototype within a short period of time.

# What we learned

This project reinforced that successful products begin with understanding people, not technology.

We learned the importance of designing for accessibility, simplifying user experiences, and validating assumptions through continuous iteration.

Perhaps most importantly, we learned that solving community problems requires empathy just as much as technical ability.

# What's next for Neighbourly Luxembourg

Our vision is to turn Neighbourly Luxembourg into a trusted nationwide community platform.

Future plans include:
- Partnering with local municipalities and non-profit organisations
- Expanding volunteer verification and safety features
- Improving accessibility for older adults
- Supporting multiple languages commonly spoken in Luxembourg
- Introducing community events and recurring volunteer opportunities
- Building analytics that help organisations understand local community needs

Ultimately, we hope Neighbourly Luxembourg becomes a platform that helps neighbours support one another and strengthens communities throughout the country.
