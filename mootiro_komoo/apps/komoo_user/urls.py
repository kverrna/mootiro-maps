#!/usr/bin/env python
# -*- coding: utf-8 -*-
from __future__ import unicode_literals
from django.conf.urls.defaults import url, patterns


urlpatterns = patterns('komoo_user.views',
    # general urls
    url(r'^login/?$', 'login', name='user_login'),
    url(r'^logout/?$', 'logout', name='user_logout'),
    url(r'^secret/?$', 'secret', name='user_secret'),

    # user creation urls
    url(r'^new/?$', 'user_new', name='user_new'),
    url(r'^verification/?$', 'user_verification', name='user_check_inbox'),
    url(r'^verification/(?P<key>\S+)/?$', 'user_verification',
            name='user_verification'),

    # per user urls
    url(r'^(?P<id>\d+)/?$', 'profile', name='user_profile'),

    # old stuff to be reviewed
    url(r'^edit/?$', 'profile_update', name='profile_update'),

    url(r'^edit/public_settings/?$',
            'profile_update_public_settings',
            name='profile_update_public_settings'),

    url(r'^edit/personal_settings/?$',
            'profile_update_personal_settings',
            name='profile_update_personal_settings'),

    url(r'^edit/digest_settings/?$', 'digest_update',
            name='digest_update'),

    url(r'^edit/signature_delete/?$', 'signature_delete',
        name='signature_delete'),

)
