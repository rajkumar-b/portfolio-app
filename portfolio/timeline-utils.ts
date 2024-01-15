const timeline_images = '../res/images/timeline/';

function createLink(url: string, display_text: string) {
    const link = document.createElement('a');
    link.href = url;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    link.textContent = display_text? display_text: url;
    return link
}

function createImage(img_location: string, alt_text: string = '') {
    const image = document.createElement('img');
    image.src = `${timeline_images}${img_location}`;
    image.alt = alt_text;
    image.onerror = () => { image.src = `${timeline_images}icons/placeholder.png`; }
    return image;
}

function createContactLink(contact_type: string, contact_name: string, contact_url: string) {
    const contactLink = document.createElement('div');
    contactLink.className = 'contact-link';
    contactLink.appendChild(createImage(`icons/${contact_type}.png`, contact_type));
    contactLink.appendChild(createLink(contact_url, contact_name));
    return contactLink
}

function createContactCard(data: any){
    const contactCard = document.createElement('section');
    contactCard.className = 'contact-holder';

    // Add profile pic
    const profilePic = document.createElement('img');
    profilePic.src = `${timeline_images}${data.profile_img}`;
    profilePic.alt = 'Profile Picture';
    profilePic.className = 'profile-pic';

    contactCard.appendChild(profilePic);

    // Add profile details
    const profileDetails = document.createElement('div');
    profileDetails.className = 'profile-details';
    
    // Link current location
    const currentLocation = document.createElement('span');
    currentLocation.className = 'current-location'; 
    currentLocation.appendChild(createImage('icons/home.png'));
    currentLocation.appendChild(createLink(`http://maps.google.com?q=${data.location_coords}`, data.current_location));
    profileDetails.appendChild(currentLocation);

    // Add profile name
    const profileName = document.createElement('p');
    profileName.className = 'profile-name';
    profileName.appendChild(document.createTextNode(`${data.first_name} ${data.last_name}`));
    profileDetails.appendChild(profileName);

    // Add profile summary
    const profileHeadline = document.createElement('span');
    profileHeadline.className = 'profile-headline';
    profileHeadline.appendChild(document.createTextNode(data.headline));
    profileDetails.appendChild(profileHeadline);

    contactCard.appendChild(profileDetails);

    // Add profile links
    const profileLinks = document.createElement('div');
    profileLinks.className = 'profile-links';

    for (const contact in data.contact_links) {
        profileLinks.appendChild(createContactLink(contact, data.contact_links[contact].text, data.contact_links[contact].link))
    }

    contactCard.appendChild(profileLinks);

    return contactCard;
}


function createTimelineItem(data: any) {
    const timelineItem = document.createElement('div');
    timelineItem.className = 'timeline-item';

    const timelineItemContent = document.createElement('div');
    timelineItemContent.className = 'timeline-item-content';

    const tag = document.createElement('span');
    tag.className = 'tag';
    tag.style.background = data.category.color;
    tag.textContent = data.category.tag;

    const time = document.createElement('time');
    time.textContent = data.date;

    const text = document.createElement('p');
    text.textContent = data.text;

    const circle = document.createElement('span');
    circle.className = 'circle';

    timelineItemContent.appendChild(tag);
    timelineItemContent.appendChild(time);
    timelineItemContent.appendChild(text);

    if (data.link) {
        timelineItemContent.appendChild(createLink(data.link.url, data.link.text));
    }

    timelineItemContent.appendChild(circle);
    timelineItem.appendChild(timelineItemContent);

    return timelineItem;
}

export {createContactCard, createTimelineItem}; 