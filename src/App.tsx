import 'bootstrap/dist/css/bootstrap.min.css';
import { useState } from 'react';
import { Container, Navbar, Form, Card, Row, Col, Button } from 'react-bootstrap';
import { TwitterLoginButton, GithubLoginButton } from 'react-social-login-buttons';

const GITHUB_PAGES="https://hyde142857.github.io/shadowverse-roommatch/";
const GITHUB_REPOS="https://github.com/hyde142857/shadowverse-roommatch";

interface TweetData {
  message: string;
  roomId: string;
  match: string;
  game: string;
  format: string;
  guildWatcher: boolean;
  friendWatcher: boolean;
}

type Props = {
  twdata: TweetData;
}

function GetTweetText(twdata: TweetData) {
  return (
    twdata.message + "\n\n"
    + "ルームID : " + twdata.roomId + "\n"
    + "対戦 : " + twdata.match + "\n"
    + "試合方式 : " + twdata.game + "\n"
    + "フォーマット : " + twdata.format + "\n"
    + "ギルドメンバーの観戦 : " + (twdata.guildWatcher ? "あり" : "なし") + "\n"
    + "フレンドの観戦 : " + (twdata.friendWatcher ? "あり" : "なし") + "\n"
    + "#シャドーバース\n"
    + "#シャドバルムマ\n"
    + "#シャドーバースルームマッチ募集\n"
    + "#ルームマッチ募集\n"
  );
}

function TweetPreview(props: Props) {
  return (
    <>
      <Card border="primary">
        <Card.Body>
          <pre>
            {GetTweetText(props.twdata)}
          </pre>
        </Card.Body>
      </Card>
    </>);
}

function submitTweet(twdata:TweetData){
  const twdata_uri = encodeURIComponent(GetTweetText(twdata));
  window.open("https://twitter.com/intent/tweet?text=" + twdata_uri + "&url=" + GITHUB_PAGES, "_blank");
}

function launchNewIssue(twdata: TweetData) {
  window.open(GITHUB_REPOS + "/issues", "_blank");
}

function launchGithub(twdata: TweetData) {
  window.open(GITHUB_PAGES, "_blank");
}

function saveLocalStorage(twdata:TweetData){
  localStorage.setItem('shadowverse_roommatch.message', twdata.message);
  localStorage.setItem('shadowverse_roommatch.match', twdata.match);
  localStorage.setItem('shadowverse_roommatch.format', twdata.format);
  localStorage.setItem('shadowverse_roommatch.game', twdata.game);
  localStorage.setItem('shadowverse_roommatch.guildwatcher', String(twdata.guildWatcher));
  localStorage.setItem('shadowverse_roommatch.friendwatcher', String(twdata.friendWatcher));
}

function loadLocalStorage() {
  let twdata: TweetData = {
    message: "",
    roomId: "",
    match: "通常",
    game: "BO1",
    format: "ローテーション",
    guildWatcher: false,
    friendWatcher: false,
  };
  twdata.message = localStorage.getItem('shadowverse_roommatch.message') || "";
  twdata.match = localStorage.getItem('shadowverse_roommatch.match') || "通常";
  twdata.game = localStorage.getItem('shadowverse_roommatch.game') || "BO1";
  twdata.format = localStorage.getItem('shadowverse_roommatch.format') || "ローテーション";
  twdata.guildWatcher = JSON.parse(localStorage.getItem('shadowverse_roommatch.guildwatcher') || 'false');
  twdata.friendWatcher = JSON.parse(localStorage.getItem('shadowverse_roommatch.friendwatcher') || 'false');
  return twdata;
}

function SaveButton(props: Props) {
  return (
    <div className="d-grid gap-2">
      <Button variant="warning" size="lg" onClick={() => saveLocalStorage(props.twdata)}>
        ブラウザにデータを保存
      </Button>
    </div>
  );
}


function TweetButton(props:Props) {
  return (
    <TwitterLoginButton onClick={() => submitTweet(props.twdata)} >
      <span>募集をツイートする</span>
    </TwitterLoginButton>
  );
}

function RequestButton(props:Props) {
  return (
    <Row>
      <Col>
        <GithubLoginButton onClick={() => launchNewIssue(props.twdata)} >
          <span>要望・問題報告</span>
        </GithubLoginButton>
      </Col>
      <Col>
        <GithubLoginButton onClick={() => launchGithub(props.twdata)} >
          <span>GitHub repository</span>
        </GithubLoginButton>
      </Col>
    </Row>
  );
}

function FormatList(props: Props) {
  let dataList: { [key: string]: string[] } = {};
  dataList["通常"] = ['ローテーション', 'アンリミテッド', 'Legacy Decks', 'ジェムオブフォーチュン'];
  dataList["2Pick"] = ['2Pick', '2Pickデック交換戦', 'オールスター 2Pick', 'Sterategy Pick'];

  const listItems = dataList[props.twdata.match].map((name) =>
    <option key={name.toString()}>{name.toString()}</option>
  );
  return (
    <>{listItems}</>
  );
}

function GameList(props: Props) {
  let dataList: { [key: string]: string[] } = {};
  dataList["通常/ローテーション"] = ['BO1', 'BO3', 'BO5', 'BO3/1BAN', 'BO5/1BAN'];
  dataList["通常/アンリミテッド"] = ['BO1', 'BO3', 'BO5', 'BO3/1BAN', 'BO5/1BAN'];
  dataList["通常/Legacy Decks"] = ['BO1'];
  dataList["通常/ジェムオブフォーチュン"] = ['BO1'];
  dataList["2Pick/2Pick"] = ['BO1', 'BO3', 'BO5'];
  dataList["2Pick/2Pickデック交換戦"] = ['BO1', 'BO3', 'BO5'];
  dataList["2Pick/オールスター 2Pick"] = ['BO1'];
  dataList["2Pick/Sterategy Pick"] = ['BO1'];

  const listItems = dataList[props.twdata.match + '/' + props.twdata.format].map((name) =>
    <option key={name.toString()}>{name.toString()}</option>
  );
  return (
    <>{listItems}</>
  );
}

function MatchGetFormatDefault(match: string) {
  if (match === '2Pick') {
    return '2Pick';
  }
  return 'ローテーション';
}

function App() {
  const [twdata, setTwdata] = useState<TweetData>(loadLocalStorage());

  return (<>
    <Navbar bg="light" expand="lg">
      <Container>
        <Navbar.Brand href="#home">Shadowverse ルームマッチ募集</Navbar.Brand>
      </Container>
    </Navbar>
    <Container>
      <Form>
        <Form.Group className="mb-3">
          <Form.Label>メッセージ</Form.Label>
          <Form.Control
            type="text"
            onChange={
              e => {
                setTwdata({ ...twdata, message: e.target.value });
              }
            }
            value={twdata.message} />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>ルームID</Form.Label>
          <Form.Control
            type="text"
            onChange={
              e => {
                setTwdata({ ...twdata, roomId: e.target.value });
              }
            }
            value={twdata.roomId} />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>対戦</Form.Label>
          <Form.Select
            onChange={
              e => {
                setTwdata({ ...twdata, match: e.target.value, format: MatchGetFormatDefault(e.target.value), game: "BO1" });
              }
            }
            value={twdata.match}
          >
            <option>通常</option>
            <option>2Pick</option>
          </Form.Select>
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>フォーマット</Form.Label>
          <Form.Select
            onChange={
              e => {
                setTwdata({ ...twdata, format: e.target.value, game: "BO1" });
              }
            }
            value={twdata.format}
          >
            <FormatList twdata={twdata}/>
          </Form.Select>
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>試合方式</Form.Label>
          <Form.Select
            onChange={
              e => {
                setTwdata({ ...twdata, game: e.target.value });
              }
            }
            value={twdata.game}
          >
            <GameList twdata={twdata}/>
          </Form.Select>
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Check type="checkbox" label="ギルドメンバーの観戦を許可"
            checked={twdata.guildWatcher}
            onChange={
              e => {
                setTwdata({ ...twdata, guildWatcher: e.target.checked });
              }
            }
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Check type="checkbox" label="フレンドの観戦を許可"
            checked={twdata.friendWatcher}
            onChange={
              e => {
                setTwdata({ ...twdata, friendWatcher: e.target.checked });
              }
            }
          />
        </Form.Group>
        <SaveButton twdata={twdata} />
        <hr />
        <TweetPreview twdata={twdata} />
        <hr />
        <TweetButton twdata={twdata} />
        <hr />
        <RequestButton twdata={twdata} />
      </Form>
    </Container></>
  );
}

export default App;
