# -*- coding: utf-8 -*-
from __future__ import unicode_literals
from django.db import models
from django.contrib.auth.models import User
from django.contrib.contenttypes import generic
from django.template.defaultfilters import slugify
from django.conf import settings
from django.core.urlresolvers import reverse

from komoo_map.models import GeoRefModel
from community.models import Community
from need.models import TargetAudience
from proposal.models import Proposal
from komoo_resource.models import Resource
from investment.models import Investment, Investor
from fileupload.models import UploadedFile
from lib.taggit.managers import TaggableManager
from vote.models import VotableModel


class Organization(VotableModel):
    name = models.CharField(max_length=320, unique=True, db_index=True)
    slug = models.SlugField(max_length=320, db_index=True)
    description = models.TextField(null=True, blank=True, db_index=True)
    logo = models.ForeignKey(UploadedFile, null=True, blank=True)

    creation_date = models.DateTimeField(auto_now_add=True)
    creator = models.ForeignKey(User, null=True, blank=True)

    community = models.ManyToManyField(Community, null=True, blank=True)

    link = models.CharField(max_length=250, null=True, blank=True)
    contact = models.TextField(null=True, blank=True)

    categories = models.ManyToManyField('OrganizationCategory', null=True, blank=True)
    target_audiences = models.ManyToManyField(TargetAudience, null=True, blank=True)

    tags = TaggableManager()

    investments = generic.GenericRelation(Investment,
                        content_type_field='grantee_content_type',
                        object_id_field='grantee_object_id')

    @property
    def as_investor(self):
        investor, created = Investor.get_or_create_for(self)
        return investor

    @property
    def realized_investments(self):
        return self.as_investor.investments.all()

    @property
    def supported_organizations(self):
        return [i.grantee for i in self.realized_investments \
                    if isinstance(i.grantee, Organization)]

    @property
    def supported_proposals(self):
        return [i.grantee for i in self.realized_investments \
                    if isinstance(i.grantee, Proposal)]

    @property
    def supported_resources(self):
        return [i.grantee for i in self.realized_investments \
                    if isinstance(i.grantee, Resource)]

    def __unicode__(self):
        return unicode(self.name)

    def save(self, *args, **kwargs):
        self.slug = slugify(self.name)
        return super(Organization, self).save(*args, **kwargs)

    def files_set(self):
        """ pseudo-reverse query for retrieving Resource Files"""
        return UploadedFile.get_files_for(self)

    @property
    def branch_count(self):
        count = OrganizationBranch.objects.filter(organization=self).count()
        return count

    image = "img/organization.png"
    image_off = "img/organization-off.png"

    # url aliases
    @property
    def home_url_params(self):
        d = dict(organization_slug=self.slug)
        return d

    @property
    def view_url(self):
        return reverse('view_organization', kwargs=self.home_url_params)

    @property
    def new_investment_url(self):
        return reverse('new_investment', kwargs=self.home_url_params)


class OrganizationBranch(GeoRefModel, VotableModel):
    name = models.CharField(max_length=320)
    slug = models.SlugField(max_length=320)

    organization = models.ForeignKey(Organization)
    info = models.TextField(null=True, blank=True)

    creation_date = models.DateTimeField(auto_now_add=True)
    creator = models.ForeignKey(User, null=True, blank=True)

    community = models.ManyToManyField(Community, null=True, blank=True)

    def __unicode__(self):
        return unicode(self.name)

    def save(self, *args, **kwargs):
        self.slug = slugify(self.name)
        return super(OrganizationBranch, self).save(*args, **kwargs)

    image = "img/organization.png"
    image_off = "img/organization-off.png"


class OrganizationCategory(models.Model):
    name = models.CharField(max_length=320, unique=True)
    slug = models.CharField(max_length=320, unique=True, blank=True)

    def __unicode__(self):
        return unicode(self.name)

    def save(self, *a, **kw):
        self.slug = slugify(self.name)
        return super(OrganizationCategory, self).save(*a, **kw)

    def get_translated_name(self):
        if settings.LANGUAGE_CODE == 'en-us':
            return self.name
        else:
            return OrganizationCategoryTranslation.objects.get(
                lang=settings.LANGUAGE_CODE, category=self).name

    @classmethod
    def get_image(cls, name):
        return "img/org_categories/%s.png" % slugify(name)

    @classmethod
    def get_image_off(cls, name):
        return "img/org_categories/%s-off.png" % slugify(name)

    @property
    def image(self):
        return self.get_image(self.name)

    @property
    def image_off(self):
        return self.get_image_off(self.name)


class OrganizationCategoryTranslation(models.Model):
    name = models.CharField(max_length=320)
    slug = models.CharField(max_length=320)
    lang = models.CharField(max_length=10)
    category = models.ForeignKey(OrganizationCategory)

    def __unicode__(self):
        return self.name

    def save(self, *a, **kw):
        self.slug = slugify(self.name)
        return super(OrganizationCategoryTranslation, self).save(*a, **kw)
