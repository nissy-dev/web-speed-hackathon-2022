import dayjs from "dayjs";
import React, { useCallback, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import styled from "styled-components";

import { FaInfoCircle } from "../../../components/icons/icons";
import { Container } from "../../../components/layouts/Container";
import {
  PlaceholderSection,
  Section,
} from "../../../components/layouts/Section";
import { Spacer } from "../../../components/layouts/Spacer";
import { TrimmedImage } from "../../../components/media/TrimmedImage";
import { TabNav } from "../../../components/navs/TabNav";
import { Heading } from "../../../components/typographies/Heading";
import { useFetch } from "../../../hooks/useFetch";
import { Color, Radius, Space } from "../../../styles/variables";
import { formatTime } from "../../../utils/DateUtils";
import { jsonFetcher } from "../../../utils/HttpUtils";

import { OddsRankingList } from "./internal/OddsRankingList";
import { OddsTable } from "./internal/OddsTable";
import { TicketVendingModal } from "./internal/TicketVendingModal";

const LiveBadge = styled.span`
  background: ${Color.red};
  border-radius: ${Radius.SMALL};
  color: ${Color.mono[0]};
  font-weight: bold;
  padding: ${Space * 1}px;
  text-transform: uppercase;
`;

const Callout = styled.aside`
  align-items: center;
  background: ${({ $closed }) =>
    $closed ? Color.mono[200] : Color.green[100]};
  color: ${({ $closed }) => ($closed ? Color.mono[600] : Color.green[500])};
  display: flex;
  font-weight: bold;
  gap: ${Space * 2}px;
  justify-content: left;
  padding: ${Space * 1}px ${Space * 2}px;
`;

/** @type {React.VFC} */
export const Odds = () => {
  const { raceId } = useParams();
  const { data } = useFetch(`/api/races/${raceId}`, jsonFetcher);
  const [oddsKeyToBuy, setOddsKeyToBuy] = useState(null);
  const modalRef = useRef(null);

  const handleClickOdds = useCallback(
    /**
     * @param {Model.OddsItem} odds
     */
    (odds) => {
      setOddsKeyToBuy(odds.key);
      modalRef.current?.showModal();
    },
    [],
  );

  const isRaceClosed = data ? dayjs(data.closeAt).isBefore(new Date()) : null;

  return (
    <Container>
      <Spacer mt={Space * 2} />
      <Heading as="h1" style={{ height: "3rem", width: "100%" }}>
        {data ? data.name : ""}
      </Heading>
      <p style={{ height: "1.5rem", width: "100%" }}>
        開始 {data ? formatTime(data.startAt) : ""} 締切{" "}
        {data ? formatTime(data.closeAt) : ""}
      </p>

      <Spacer mt={Space * 2} />
      <PlaceholderSection dark shrink>
        <LiveBadge>Live</LiveBadge>
        <Spacer mt={Space * 2} />
        <TrimmedImage
          height={225}
          src={data ? `${data.image.slice(0, -4)}-400-225.webp` : undefined}
          width={400}
        />
      </PlaceholderSection>

      <Spacer mt={Space * 2} />

      <Section>
        <TabNav>
          <TabNav.Item to={`/races/${raceId}/race-card`}>出走表</TabNav.Item>
          <TabNav.Item aria-current to={`/races/${raceId}/odds`}>
            オッズ
          </TabNav.Item>
          <TabNav.Item to={`/races/${raceId}/result`}>結果</TabNav.Item>
        </TabNav>

        <Spacer mt={Space * 4} />
        <Callout $closed={isRaceClosed}>
          <FaInfoCircle />
          {isRaceClosed
            ? "このレースの投票は締め切られています"
            : "オッズをクリックすると拳券が購入できます"}
        </Callout>
        <Spacer mt={Space * 4} />
        <Heading as="h2">オッズ表</Heading>

        {data ? (
          <>
            <Spacer mt={Space * 2} />
            <OddsTable
              entries={data.entries}
              isRaceClosed={isRaceClosed}
              odds={data.trifectaOdds}
              onClickOdds={handleClickOdds}
            />
            <Spacer mt={Space * 4} />
            <Heading as="h2">人気順</Heading>

            <Spacer mt={Space * 2} />
            <OddsRankingList
              isRaceClosed={isRaceClosed}
              odds={data.trifectaOdds}
              onClickOdds={handleClickOdds}
            />
          </>
        ) : (
          <div style={{ minHeight: "100vh" }}></div>
        )}
      </Section>

      <TicketVendingModal ref={modalRef} odds={oddsKeyToBuy} raceId={raceId} />
    </Container>
  );
};
