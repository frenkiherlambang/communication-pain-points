-- Customer Feedbacks Table
-- This table stores customer feedback data from various sources like social media, support channels, etc.

create table if not exists customer_feedbacks (
  id uuid primary key default gen_random_uuid(),
  link text,
  post_copy text,
  date date not null,
  time time not null,
  date_responses date,
  account_id text not null,
  customer_id text,
  category text check (category in ('Im', 'General', 'Ctv', 'Da')) default 'General',
  type_of_post text check (type_of_post in ('Queries', 'Complaint', 'Compliment', 'Others')) default 'Others',
  topic text check (topic in ('Product Info', 'Promo', 'Technical', 'Product Release', 'E-commerce', 'Service Center', 'Sponsor, Parternship, Job', 'Pricing', 'SES')) default 'Product Info',
  product text,
  sentiment text check (sentiment in ('Positive', 'Neutral', 'Negative')) default 'Neutral',
  source text check (source in ('DM Facebook', 'Comment Facebook')) default 'DM Facebook',
  reply text,
  status text check (status in ('Clear', 'Pending')) default 'Pending',
  details text,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Create indexes for better query performance
create index if not exists idx_customer_feedbacks_date on customer_feedbacks(date);
create index if not exists idx_customer_feedbacks_sentiment on customer_feedbacks(sentiment);
create index if not exists idx_customer_feedbacks_category on customer_feedbacks(category);
create index if not exists idx_customer_feedbacks_topic on customer_feedbacks(topic);
create index if not exists idx_customer_feedbacks_status on customer_feedbacks(status);
create index if not exists idx_customer_feedbacks_account_id on customer_feedbacks(account_id);

-- Create a trigger to automatically update the updated_at timestamp
create or replace function update_customer_feedbacks_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger trigger_update_customer_feedbacks_updated_at
  before update on customer_feedbacks
  for each row
  execute function update_customer_feedbacks_updated_at();

-- Insert sample data (optional - can be used for testing)
-- This data matches the sample data structure from the TypeScript file
insert into customer_feedbacks (
  id, link, post_copy, date, time, date_responses, account_id, customer_id, 
  category, type_of_post, topic, product, sentiment, source, reply, status, details
) values 
  (
    '00000000-0000-0000-0000-000000000001',
    '',
    'Blackberry 06 msh ada kk',
    '2025-03-05',
    '12:59:00',
    '2025-03-05',
    'Arjuna Rajendra',
    '',
    'Im',
    'Queries',
    'Product Info',
    'Galaxy A06',
    'Neutral',
    'DM Facebook',
    'Halo kak Arjuna, #GalaxyA06 Light Green bisa kamu dapatkan di Blackberry.com/id dengan harga Rp1.999.000',
    'Clear',
    'Availability'
  ),
  (
    '00000000-0000-0000-0000-000000000002',
    '',
    'Kak untuk s25 reguler yg coral red itu ready di indo ngga ya?',
    '2025-03-04',
    '23:28:00',
    '2025-03-05',
    'Tyoo Prasetyoo',
    '',
    'Im',
    'Queries',
    'Product Info',
    'Galaxy S25 | S25+ | S25 Ultra',
    'Neutral',
    'DM Facebook',
    'Hi kak Tyo, saat ini tersedia Galaxy S25 512GB warna Coralred yang bisa kamu dapatkan di http://smsng.co/GalaxyS25Series_c',
    'Clear',
    'Availability'
  ),
  (
    '00000000-0000-0000-0000-000000000003',
    '',
    'Ini Blackberry gimana yah Pre order dari tanggal 25 Januari sampai sekarang tak kunjung pickup',
    '2025-03-02',
    '16:48:00',
    '2025-03-05',
    'Agus Tinus',
    '',
    'Im',
    'Complaint',
    'Product Release',
    'Galaxy S25 | S25+ | S25 Ultra',
    'Negative',
    'DM Facebook',
    'Hi kak Agus, kami mohon maaf atas ketidaknyamanan yang dialami. Kami sangat menghargai antusiasmenya pada Galaxy S25 Series.',
    'Clear',
    'Delayed PO'
  ),
  (
    '00000000-0000-0000-0000-000000000004',
    '',
    'Galaxy S25 camera quality is amazing!',
    '2025-03-01',
    '10:30:00',
    '2025-03-01',
    'Happy Customer',
    '',
    'Im',
    'Compliment',
    'Product Info',
    'Galaxy S25',
    'Positive',
    'DM Facebook',
    'Thank you for your positive feedback!',
    'Clear',
    'Product satisfaction'
  ),
  (
    '00000000-0000-0000-0000-000000000005',
    '',
    'Love the new Galaxy A56 features',
    '2025-03-02',
    '14:20:00',
    '2025-03-02',
    'Tech Enthusiast',
    '',
    'Im',
    'Compliment',
    'Product Info',
    'Galaxy A56',
    'Positive',
    'DM Facebook',
    'We are glad you love the new features!',
    'Clear',
    'Feature appreciation'
  )
on conflict (id) do nothing;