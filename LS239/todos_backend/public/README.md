#Todos Project
##John Vaughn
###LaunchSchool 239

Assumptions:

There were a couple of things in the reference at https://d3905n0khyu9wc.cloudfront.net/assessment/todo-js/todo_v3.html that seemed like bugs (on Chrome version 63.0.3239.84) to me so I didn't implement them.  

1. When editing a todo item, it will usually load and select the month *number* in the month select box, instead of choosing the correct month name in the list.  Also, if you change the day, month, and/or year and *don't* save, then edit the same todo again, the modal reflects the change. However it seems that data was not posted to the server because that change disappears if you reload the page.

2. The cursor changes to a pointer over most of the nav items, but not over the "Completed" line. 

Also, maybe not a bug, but the reference version allows todo titles as short as desired (even empty strings).  The backend API server we received reports an error if the title is under 3 characters long. So I added an alert to require the user to enter at least 3 chars for the title.

That's it. Thanks!

John