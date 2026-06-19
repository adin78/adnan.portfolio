const header=document.querySelector('[data-header]');
const menuButton=document.querySelector('[data-menu-button]');
const menu=document.querySelector('[data-menu]');
const syncHeader=()=>header?.classList.toggle('scrolled',window.scrollY>24);
syncHeader();window.addEventListener('scroll',syncHeader,{passive:true});
menuButton?.addEventListener('click',()=>{const open=menu.classList.toggle('open');menuButton.classList.toggle('active',open);menuButton.setAttribute('aria-expanded',String(open));document.body.classList.toggle('menu-open',open)});
menu?.querySelectorAll('a').forEach(link=>link.addEventListener('click',()=>{menu.classList.remove('open');menuButton?.classList.remove('active');menuButton?.setAttribute('aria-expanded','false');document.body.classList.remove('menu-open')}));
document.querySelectorAll('[data-year]').forEach(el=>el.textContent=new Date().getFullYear());

// Create a second, hidden copy so the tools bar loops without a visible gap.
document.querySelectorAll('[data-marquee-track]').forEach(track=>{
  const sequence=track.querySelector('[data-marquee-sequence]');
  if(!sequence)return;
  const copy=sequence.cloneNode(true);
  copy.removeAttribute('data-marquee-sequence');
  copy.setAttribute('aria-hidden','true');
  track.appendChild(copy);
});

const content=window.PORTFOLIO_CONTENT;

if(content){
  const consultations=document.querySelector('[data-consultations]');
  if(consultations){
    consultations.innerHTML=content.consultationTypes.map((item,index)=>`
      <article class="consultation-card">
        <div class="consultation-number">0${index+1}</div>
        <p>${item.duration}</p><h3>${item.title}</h3><p>${item.description}</p>
        <div>${item.topics.map(topic=>`<span>${topic}</span>`).join('')}</div>
      </article>`).join('');
  }

  const availability=document.querySelector('[data-availability]');
  if(availability) availability.innerHTML=content.availability.map(slot=>`<span>${slot}</span>`).join('');

  const bookingLink=document.querySelector('[data-booking-link]');
  const meetLink=document.querySelector('[data-meet-link]');
  const bookingNote=document.querySelector('[data-booking-note]');
  const setOptionalLink=(link,url,label)=>{
    if(!link)return;
    if(url){link.href=url;link.target='_blank';link.rel='noopener';}
    else{link.classList.add('link-disabled');link.setAttribute('aria-disabled','true');link.addEventListener('click',event=>event.preventDefault());if(label)link.firstChild.textContent=label+' ';}
  };
  setOptionalLink(bookingLink,content.contact.bookingUrl,'Calendar coming soon');
  setOptionalLink(meetLink,content.contact.googleMeetUrl,'Google Meet link coming soon');
  if(bookingNote) bookingNote.textContent=content.contact.bookingUrl?'Times shown in your local timezone.':'Add your Google Calendar booking link in assets/content.js.';

  document.querySelectorAll('[data-email-link]').forEach(link=>{link.href=`mailto:${content.contact.email}`;link.textContent=content.contact.email});
  document.querySelectorAll('[data-linkedin-link]').forEach(link=>link.href=content.contact.linkedin);
  document.querySelectorAll('[data-response-time]').forEach(el=>el.textContent=content.contact.responseTime+'.');

  const select=document.querySelector('[data-consultation-select]');
  if(select) select.insertAdjacentHTML('beforeend',content.consultationTypes.map(item=>`<option>${item.title}</option>`).join(''));

  const form=document.querySelector('[data-consultation-form]');
  form?.addEventListener('submit',event=>{
    event.preventDefault();
    if(!form.reportValidity())return;
    const values=new FormData(form);
    const subject=encodeURIComponent(`Consultation inquiry: ${values.get('type')}`);
    const body=encodeURIComponent(`Hi Adnan,\n\nMy name is ${values.get('name')} (${values.get('email')}).\n\nConsultation: ${values.get('type')}\nApp / game: ${values.get('app')||'Not provided'}\n\nWhat I would like to solve:\n${values.get('message')}\n\nBest regards,\n${values.get('name')}`);
    window.location.href=`mailto:${content.contact.email}?subject=${subject}&body=${body}`;
  });

  const faqList=document.querySelector('[data-faqs]');
  if(faqList) faqList.innerHTML=content.faqs.map((item,index)=>`
    <details ${index===0?'open':''}><summary>${item.question}<span aria-hidden="true">+</span></summary><p>${item.answer}</p></details>`).join('');

  const blogIndex=document.querySelector('[data-blog-index]');
  const blogArticles=document.querySelector('[data-blog-articles]');
  if(blogIndex) blogIndex.innerHTML=content.blogs.map(post=>`
    <a class="blog-index-card" href="#${post.id}"><span>${post.category} · ${post.readTime}</span><h2>${post.title}</h2><p>${post.summary}</p><b>Read article →</b></a>`).join('');
  if(blogArticles) blogArticles.innerHTML=content.blogs.map(post=>`
    <article class="article" id="${post.id}"><aside class="article-meta">${post.category}<br>${post.readTime}<br><time>${post.date}</time></aside><div class="article-content"><h2>${post.title}</h2>${post.content}<a class="text-link" href="#top" onclick="window.scrollTo({top:0,behavior:'smooth'});return false;">Back to articles ↑</a></div></article>`).join('');
}
