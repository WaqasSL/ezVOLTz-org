import mailchimp from '@mailchimp/mailchimp_marketing';

function splitName(name) {
  const nameParts = name.trim().split(/\s+/);
  let firstName = nameParts[0];
  let lastName = '';
  if (nameParts.length > 1) {
    lastName = nameParts.slice(1).join(' ');
  }

  return { firstName, lastName };
}

export async function addAndSubscribeUser(user) {
  const listId = '0bb3f69251';
  const { firstName, lastName } = splitName(user.name);

  const response = await mailchimp.lists.addListMember(listId, {
    email_address: user.email,
    status: 'subscribed',
    merge_fields: {
      FNAME: firstName,
      LNAME: lastName,
      number: user.phone,
    },
  });

  return response;
}

export async function subscribeUser(user) {
  const listId = '0bb3f69251';
  const response = await mailchimp.lists
    .getListMember(listId, user.email)
    .catch((error) => {
      if (error.status === 404) {
        addAndSubscribeUser(user);
      }
    });

  if (response.status === 'unsubscribed') {
    await mailchimp.lists.updateListMember(listId, user.email, {
      status: 'subscribed',
    });
  }
  return response;
}

export async function unsubscribeUser(user) {
  const listId = '0bb3f69251';
  const response = await mailchimp.lists.getListMember(listId, user.email);

  if (response.status === 'subscribed') {
    await mailchimp.lists.updateListMember(listId, user.email, {
      status: 'unsubscribed',
    });
  }
  return response;
}

export async function removeUser(user) {
  const listId = '0bb3f69251';
  const response = await mailchimp.lists.getListMember(listId, user.email);

  if (response.status === 'subscribed') {
    await mailchimp.lists.deleteListMember(listId, user.email);
  }
  return response;
}
