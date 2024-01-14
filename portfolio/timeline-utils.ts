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
        const link = document.createElement('a');
        link.href = data.link.url;
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
        link.textContent = data.link.text;
        timelineItemContent.appendChild(link);
    }

    timelineItemContent.appendChild(circle);
    timelineItem.appendChild(timelineItemContent);

    return timelineItem;
}

export {createTimelineItem}; 