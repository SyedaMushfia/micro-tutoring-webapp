import React from 'react';

type HelpSectionProps = {
  role: 'student' | 'tutor';
};

const studentSteps = [
  {
    title: 'Create your account and sign in',
    description: 'Sign up as a student, complete your profile details, and log in to your dashboard. You can update your profile and change your password any time from Settings.',
  },
  {
    title: 'Top up your wallet',
    description: 'Before asking a question, make sure your wallet has enough balance. The app charges a small fee per question, and you can see your balance and payment history from the Wallet section.',
  },
  {
    title: 'Ask a question',
    description: 'Open the dashboard and submit your question, then choose the subject and wait for a tutor to accept it. Your request is sent to available tutors in the system.',
  },
  {
    title: 'Join the session',
    description: 'Once a tutor accepts your request, join the live session room from the notification or your session list. You can ask questions, get explanations, and work through your lesson in real time.',
  },
  {
    title: 'End and review the session',
    description: 'When the lesson is complete, the session ends automatically or you can end it from the session controls. After that, the payment is processed and your session history is saved.',
  },
];

const tutorSteps = [
  {
    title: 'Create your account and complete your profile',
    description: 'Sign up as a tutor, fill in your name, bio, subjects, and qualifications, and update your profile photo from Settings. This helps students trust and choose you.',
  },
  {
    title: 'Go online and wait for requests',
    description: 'Once your profile is ready, keep your dashboard active and accept student questions that match your subjects. Students can only begin a session after you accept.',
  },
  {
    title: 'Review incoming requests',
    description: 'Check the question request list, confirm the student need, and decide which sessions to accept. Make sure you are available and ready for the topic before joining.',
  },
  {
    title: 'Start and teach the session',
    description: 'When you accept a request, open the live session room and guide the student through the question. You can explain, answer, and support them until the learning goal is met.',
  },
  {
    title: 'End the session and receive payment',
    description: 'Finish the lesson, either from the session controls or when the session naturally ends. The system records the session and credits your earnings for review in the Earnings section.',
  },
];

const studentFaqs = [
  {
    q: 'How long can a session be?',
    a: 'Most sessions are designed to last around 20 minutes, but the exact duration depends on the tutoring flow and the pace of the lesson. The app keeps the session simple and focused so help is quick and efficient.',
  },
  {
    q: 'How do I join my session?',
    a: 'After a tutor accepts your request, you will be able to enter the live session room from your dashboard or the session notification. Once inside, you can start chatting and continue with the tutor immediately.',
  },
  {
    q: 'What happens when my session ends?',
    a: 'When the session ends, the app records the session as complete, updates your history, and processes any payment due for the tutoring time. You can review the details in your dashboard history or wallet.',
  },
  {
    q: 'Can I end a session?',
    a: 'Yes. If you are ready to finish early, you can end the session from the session controls. The tutor and the system will then mark it as completed and finalize the activity.',
  },
  {
    q: 'How do I pay for a session?',
    a: 'You pay from your wallet balance. Add money using the Wallet section, and each question uses the available balance when the session is processed. Your wallet updates automatically after the session ends.',
  },
  {
    q: 'Where can I see my payment history?',
    a: 'Go to the Wallet section and open the recharge history. This shows your top-ups and recent payment activity so you can track how much you have spent.',
  },
];

const tutorFaqs = [
  {
    q: 'How do I accept a session request?',
    a: 'Open the question requests section from your dashboard, review the student’s problem, and click accept when you are ready to help. Once accepted, the session room is created for the student to join.',
  },
  {
    q: 'How long are tutoring sessions?',
    a: 'Tutoring sessions are typically set for around 20 minutes, which keeps the support fast, focused, and easy to manage. The timing is meant to help students get quick answers without long waiting periods.',
  },
  {
    q: 'What happens when a session ends?',
    a: 'The session is marked complete, your earnings are calculated, and the result is added to your tutoring history. Students also receive the completed session record for their own history.',
  },
  {
    q: 'How do I end a session?',
    a: 'You can end a session from the live session controls when the student has received the help they need. Ending the session finalizes the tutoring record and updates payment details.',
  },
  {
    q: 'How do I get paid?',
    a: 'Once a session is completed, the app credits your earnings automatically to your tutor account. You can check the total amount in the Earnings section and review each completed transaction in your earnings history.',
  },
  {
    q: 'Where can I see my earnings?',
    a: 'Open the Earnings section from the dashboard menu. There you can view your total earnings, recent payouts, and the overall trend for your tutoring activity.',
  },
];

function HelpSection({ role }: HelpSectionProps) {
  const steps = role === 'student' ? studentSteps : tutorSteps;
  const faqs = role === 'student' ? studentFaqs : tutorFaqs;

  return (
    <div className='w-full pt-4 text-[#2e294e]'>
      <div className='grid gap-6 lg:grid-cols-2'>
        <section className='rounded-2xl bg-[#f2f4fc] p-5 shadow-lg ring-1 ring-[#e5e7eb] md:p-6'>
          <div className='mb-5'>
            <h2 className='text-xl font-semibold'>How it works</h2>
          </div>

          <ol className='space-y-4'>
            {steps.map((step, index) => (
              <li key={step.title} className='flex gap-3 rounded-xl bg-white p-4 shadow-sm ring-1 ring-[#e5e7eb]'>
                <span className='flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#2e294e] text-sm font-semibold text-white'>
                  {index + 1}
                </span>
                <div>
                  <h3 className='font-semibold text-[#2e294e]'>{step.title}</h3>
                  <p className='mt-1 text-sm leading-6 text-[#555]'>{step.description}</p>
                </div>
              </li>
            ))}
          </ol>
        </section>

        <section className='rounded-2xl bg-[#f2f4fc] p-5 shadow-lg ring-1 ring-[#e5e7eb] md:p-6'>
          <div className='mb-5'>
            <h2 className='text-xl font-semibold'>FAQ</h2>
          </div>

          <div className='space-y-4'>
            {faqs.map((item) => (
              <div key={item.q} className='rounded-xl bg-white p-4 shadow-sm ring-1 ring-[#e5e7eb]'>
                <h3 className='font-semibold text-[#2e294e]'>{item.q}</h3>
                <p className='mt-2 text-sm leading-6 text-[#555]'>{item.a}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

export default HelpSection;
