import JoinOrLeave from '@components/Shared/Community/JoinOrLeave';
import Markup from '@components/Shared/Markup';
import Slug from '@components/Shared/Slug';
import { CalendarIcon, CogIcon } from '@heroicons/react/outline';
import { EXPANDED_AVATAR, STATIC_IMAGES_URL } from '@lenster/data/constants';
import getAvatar from '@lenster/lib/getAvatar';
import sanitizeDisplayName from '@lenster/lib/sanitizeDisplayName';
import type { Community } from '@lenster/types/communities';
import { Button, Image, LightBox } from '@lenster/ui';
import { formatDate } from '@lib/formatTime';
import { Trans } from '@lingui/macro';
import Link from 'next/link';
import { useTheme } from 'next-themes';
import type { FC, ReactNode } from 'react';
import { useState } from 'react';
import { useAppStore } from 'src/store/app';

import Members from './Members';
import Rules from './Rules';

interface DetailsProps {
  community: Community;
}

const Details: FC<DetailsProps> = ({ community }) => {
  const currentProfile = useAppStore((state) => state.currentProfile);
  const [expandedImage, setExpandedImage] = useState<string | null>(null);
  const { resolvedTheme } = useTheme();

  const MetaDetails = ({
    children,
    icon,
    dataTestId = ''
  }: {
    children: ReactNode;
    icon: ReactNode;
    dataTestId?: string;
  }) => (
    <div className="flex items-center gap-2" data-testid={dataTestId}>
      {icon}
      <div className="text-md truncate">{children}</div>
    </div>
  );

  return (
    <div className="mb-4 space-y-5 px-5 sm:px-0">
      <div className="h-32 w-32 sm:h-52 sm:w-52">
        <Image
          onClick={() =>
            setExpandedImage(getAvatar(community, EXPANDED_AVATAR))
          }
          src={getAvatar(community)}
          className="h-32 w-32 cursor-pointer rounded-xl bg-gray-200 ring-8 ring-gray-50 dark:bg-gray-700 dark:ring-black sm:h-52 sm:w-52"
          height={128}
          width={128}
          alt={community.slug}
          data-testid="profile-avatar"
        />
        <LightBox
          show={Boolean(expandedImage)}
          url={expandedImage}
          onClose={() => setExpandedImage(null)}
        />
      </div>
      <div className="space-y-1 py-2">
        <div className="flex items-center gap-1.5 text-2xl font-bold">
          <div className="truncate" data-testid="profile-name">
            {sanitizeDisplayName(community?.name) ?? community.slug}
          </div>
        </div>
        <div
          className="flex items-center space-x-3"
          data-testid="profile-handle"
        >
          <Slug
            className="text-sm sm:text-base"
            slug={community.slug}
            prefix="c/"
          />
        </div>
      </div>
      {community?.description && (
        <div
          className="markup linkify text-md mr-0 break-words sm:mr-10"
          data-testid="profile-bio"
        >
          <Markup>{community.description}</Markup>
        </div>
      )}
      <div className="space-y-5">
        <Members community={community} />
        <div className="flex items-center space-x-2">
          {currentProfile?.id === community.admin ? (
            <Link href="/settings">
              <Button
                variant="secondary"
                icon={<CogIcon className="h-5 w-5" />}
                outline
              >
                <Trans>Edit Community</Trans>
              </Button>
            </Link>
          ) : (
            <JoinOrLeave community={community} />
          )}
        </div>
        <div className="divider w-full" />
        <div className="space-y-2">
          {community?.website && (
            <MetaDetails
              icon={
                <img
                  src={`https://www.google.com/s2/favicons?domain=${community.website
                    ?.replace('https://', '')
                    .replace('http://', '')}`}
                  className="h-4 w-4 rounded-full"
                  height={16}
                  width={16}
                  alt="Website"
                />
              }
              dataTestId="community-meta-website"
            >
              <Link
                href={`https://${community.website
                  ?.replace('https://', '')
                  .replace('http://', '')}`}
                target="_blank"
                rel="noreferrer noopener me"
              >
                {community.website
                  ?.replace('https://', '')
                  .replace('http://', '')}
              </Link>
            </MetaDetails>
          )}
          {community?.twitter && (
            <MetaDetails
              icon={
                resolvedTheme === 'dark' ? (
                  <img
                    src={`${STATIC_IMAGES_URL}/brands/twitter-light.svg`}
                    className="h-4 w-4"
                    height={16}
                    width={16}
                    alt="Twitter Logo"
                  />
                ) : (
                  <img
                    src={`${STATIC_IMAGES_URL}/brands/twitter-dark.svg`}
                    className="h-4 w-4"
                    height={16}
                    width={16}
                    alt="Twitter Logo"
                  />
                )
              }
              dataTestId="community-meta-twitter"
            >
              <Link
                href={`https://twitter.com/${community.twitter?.replace(
                  'https://twitter.com/',
                  ''
                )}`}
                target="_blank"
                rel="noreferrer noopener"
              >
                {community.twitter?.replace('https://twitter.com/', '')}
              </Link>
            </MetaDetails>
          )}
          <MetaDetails
            icon={<CalendarIcon className="h-4 w-4" />}
            dataTestId="community-meta-twitter"
          >
            <Trans>
              Created on {formatDate(new Date(community.created_at))}
            </Trans>
          </MetaDetails>
        </div>
        <Rules rules={community.rules} />
      </div>
    </div>
  );
};

export default Details;
