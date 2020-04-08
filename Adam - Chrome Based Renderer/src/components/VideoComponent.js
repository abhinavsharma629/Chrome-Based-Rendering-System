import React from "react";
import LoadingComponent from "./LoadingComponent";
import axios from "axios";
import Snackbar from "@material-ui/core/Snackbar";
import Alerts from "./Alerts";
import { SERVER_ENDPOINT } from "./utilPoints";
import { Image } from "react-bootstrap";
import ReactPlayer from "react-player";

class VideoComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      start: 1,
      prevStart: 0,
      hasStarted: true,
      limit: 3,
      askForNew: false,
      isPlaying: true,
      hasStartedNum: false,
      playlist: [
        {
          advertiser_id: "admin",
          creative_id: "admin",
          duration: 7,
          file_details: {
            asset_name: "testvideo10-1577146532999-default-3-0.mp4",
            src: "https://youtu.be/6NJWbbGWItE",
            timestamp: 1577146532999,
            type: "video"
          },
          file_path:
            "C:/Users/User/Desktop/Embereon Assignment/embereon_adam/public/assets/testvideo10-1577146532999-default-3-0.mp4"
        }
      ],
      flashShow: false,
      flashMessage: "",
      severity: "error",
      ended: false,
      currentSource: "/assets/testvideo10-1577146532999-default-3-0.mp4",
      currCounter: 0,
      currType: "video",
      currDuration: 7
    };
  }

  async componentDidMount() {
    console.log("inside componentDidMount of VideoComponent");
    this.fetchData(
      this.state.start,
      this.state.prevStart,
      this.state.limit,
      this.state.askForNew
    );
  }

  fetchData = (start, prevStart, limit, askForNew) => {
    // Fetch Playlist
    axios
      .get(
        SERVER_ENDPOINT +
          `api/playlist/adamPlaylist?start=${start}&prevStart=${
            prevStart
          }&limit=${limit}&askForNew=${askForNew}`,
        {
          headers: {
            "Content-Type": "application/json"
          }
        }
      )
      .then(
        response => {
          let updated_playlist = [];
          let currCounter = this.state.currCounter;

          // If askForNew is true therefore no new data fetched from api. Set currCounter to 0
          if (response.data.askForNew === true) {
            updated_playlist = this.state.playlist;
            currCounter = 0;
          } else {
            // Else new data fetched therefore append in the playlist
            updated_playlist = [
              ...this.state.playlist,
              ...response.data.playlist
            ];
          }

          // If advertisement is playing currently
          if (this.state.isPlaying) {
            this.setState({
              isLoading: false,
              hasStarted: false,
              currCounter: currCounter,
              start: response.data.start,
              prevStart: response.data.prevStart,
              askForNew: response.data.askForNew,
              playlist: updated_playlist
            });
          } else {
            // If no advertisement is playing currently
            this.setState(
              {
                isLoading: false,
                isPlaying: true,
                hasStarted: false,
                currCounter: currCounter,
                start: response.data.start,
                prevStart: response.data.prevStart,
                askForNew: response.data.askForNew,
                playlist: updated_playlist,
                currentSource:
                  "/assets/" +
                  updated_playlist[currCounter]["file_details"]["asset_name"],
                currType: updated_playlist[currCounter]["file_details"]["type"],
                currDuration: updated_playlist[currCounter]["duration"]
              },
              () => {
                if (this.state.currType === "image") {
                  this.setTimeoutOfImage(
                    updated_playlist[currCounter]["duration"]
                  );
                }
              }
            );
          }
        },
        // If api gives error in returning data
        err => {
          let currCounter = this.state.currCounter;

          // If askForNew is true therefore no new data fetched from api. Set currCounter to 0
          if (this.state.askForNew === true) {
            currCounter = 0;
          } else if (this.state.currCounter + 1 >= this.state.playlist.length) {
            // If updating the counter will result in overflow
            currCounter = 0;
          } else if (this.state.currCounter + 1 < this.state.playlist.length) {
            // If updating the counter is a valid move
            currCounter += 1;
          }

          // If already an advertisement is playing
          if (this.state.isPlaying) {
            this.setState({
              isLoading: false,
              hasStarted: false,
              currCounter: currCounter
            });
          } else {
            // If no advertisement is being played currently
            this.setState(
              {
                isLoading: false,
                flashShow: true,
                hasStarted: false,
                currCounter: currCounter,
                flashMessage:
                  "Sorry we encountered some Error while Fetching new Playlist",
                severity: "error",
                currentSource:
                  "/assets/" +
                  this.state.playlist[currCounter]["file_details"][
                    "asset_name"
                  ],
                currType: this.state.playlist[currCounter]["file_details"][
                  "type"
                ],
                currDuration: this.state.playlist[currCounter]["duration"]
              },
              () => {
                if (this.state.currType === "image") {
                  this.setTimeoutOfImage(
                    this.state.playlist[currCounter]["duration"]
                  );
                }
              }
            );
          }
        }
      );
  };

  // Setting Timeout of current Image
  setTimeoutOfImage = duration => {
    console.log("setting new timeout of Image");

    setTimeout(() => {
      console.log("Image Duration Timed Out");
      // Update element when image duration Timed Out
      this.updateCurrentElement();
    }, duration * 1000);
  };

  // Update currCounter when video finishes playing
  handleStateChange() {
    // If the default video is not playing
    if (!this.state.hasStarted) {
      if (this.state.currCounter + 1 >= this.state.playlist.length) {
        this.setState(
          {
            isPlaying: true,
            currType: this.state.playlist[0]["file_details"]["type"],
            currDuration: this.state.playlist[0]["duration"],
            currentSource:
              "/assets/" + this.state.playlist[0]["file_details"]["asset_name"]
          },
          () => {
            if (this.state.currType === "image") {
              this.setTimeoutOfImage(this.state.playlist[0]["duration"]);
            }
          }
        );
        this.fetchData(
          this.state.start,
          this.state.prevStart,
          this.state.limit,
          this.state.askForNew
        );
      } else {
        this.setState(
          {
            isPlaying: true,
            currType: this.state.playlist[this.state.currCounter + 1][
              "file_details"
            ]["type"],
            currDuration: this.state.playlist[this.state.currCounter + 1][
              "duration"
            ],
            currentSource:
              "/assets/" +
              this.state.playlist[this.state.currCounter + 1]["file_details"][
                "asset_name"
              ],
            currCounter: this.state.currCounter + 1
          },
          () => {
            if (this.state.currType === "image") {
              this.setTimeoutOfImage(
                this.state.playlist[this.state.currCounter]["duration"]
              );
            }
          }
        );
      }
    } else {
      // If the default video is playing ie. no new data is currently fetched then keep looping on the default video
      this.setState({ hasStartedNum: !this.state.hasStartedNum });
    }
  }

  // Counter update after Image duration Time Out
  updateCurrentElement = () => {
    console.log("updating element after timeout");

    // If on updating the counter it overflows
    if (this.state.currCounter + 1 >= this.state.playlist.length) {
      // Repeat the default video until new data is fetched
      this.setState(
        {
          isPlaying: true,
          currType: this.state.playlist[0]["file_details"]["type"],
          currDuration: this.state.playlist[0]["duration"],
          currentSource:
            "/assets/" + this.state.playlist[0]["file_details"]["asset_name"]
        },
        () => {
          if (this.state.currType === "image") {
            this.setTimeoutOfImage(this.state.playlist[0]["duration"]);
          }
        }
      );
      this.fetchData(
        this.state.start,
        this.state.prevStart,
        this.state.limit,
        this.state.askForNew
      );
    } else {
      // Update the counter and display the next element on the playlist
      this.setState(
        {
          isPlaying: true,
          currType: this.state.playlist[this.state.currCounter + 1][
            "file_details"
          ]["type"],
          currDuration: this.state.playlist[this.state.currCounter + 1][
            "duration"
          ],
          currentSource:
            "/assets/" +
            this.state.playlist[this.state.currCounter + 1]["file_details"][
              "asset_name"
            ],
          currCounter: this.state.currCounter + 1
        },
        () => {
          if (this.state.currType === "image") {
            this.setTimeoutOfImage(
              this.state.playlist[this.state.currCounter]["duration"]
            );
          }
        }
      );
    }
  };

  render() {
    if (this.state.isLoading) {
      return <LoadingComponent />;
    } else {
      return (
        <div>
          <Snackbar
            open={this.state.flashShow}
            autoHideDuration={2000}
            onClose={() => {
              this.setState({ flashShow: false });
            }}
          >
            <Alerts
              flashMessage={this.state.flashMessage}
              severity={this.state.severity}
            />
          </Snackbar>

          {this.state.currType === "image" ? (
            <Image
              src={this.state.currentSource}
              fluid
              style={{
                width: window.innerWidth - 5,
                height: window.innerHeight - 5
              }}
            />
          ) : (
            <ReactPlayer
              url={this.state.currentSource}
              playing={true}
              className="react-player"
              controls={false}
              onEnded={() => this.handleStateChange()}
              width="100%"
              height="100%"
              style={{
                position: "absolute",
                top: 0,
                left: 0
              }}
            />
          )}
        </div>
      );
    }
  }
}
export default VideoComponent;
