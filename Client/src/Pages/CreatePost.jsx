import React, { useState } from "react";
import { Formfeild, Loader } from "../Components";
import { useNavigate } from "react-router-dom";
import { preview } from "../assets";
import { GetRandomPrompt } from "../Utils";

const CreatePost = () => {
  const [loading, setloading] = useState(false);
  const Navigate = useNavigate();
  const [Form, setForm] = useState({
    name: "",
    prompt: "",
    picture: "",
  });
  const [GeneratingImg, setGeneratingImg] = useState(false);
  const GenerateIMG = async () => {
    if (Form.prompt) {
      try {
        setGeneratingImg(true);
        const response = await fetch("http://localhost:8080/api/v1/AiIMAGE", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            prompt: Form.prompt,
          }),
        });

        const data = await response.json();
        setForm({ ...Form, picture: `data:image/jpeg;base64,${data.photo}` });
      } catch (err) {
        alert(err);
      } finally {
        setGeneratingImg(false);
      }
    } else {
      alert("Please provide proper prompt");
    }
  };
  const handlesubmit = async (e) => {
    e.preventDefault();
    if (Form.prompt && Form.picture) {
      setloading(true);
      console.log("running");
      try {
        const Response = await fetch("http://localhost:8080/api/v1/post", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ ...Form }),
        });
        await Response.json();
        console.log(Response);
        Navigate("/");
      } catch (error) {
        console.log(error);
      } finally {
        setloading(false);
      }
    } else {
      alert("Please Enter Prompt and Generate The Image");
    }
  };
  const handleChange = (e) => {
    setForm({ ...Form, [e.target.name]: e.target.value });
  };
  const handleIsSupriseME = () => {
    const Suprise = GetRandomPrompt();
    setForm({ ...Form, prompt: Suprise });
  };
  return (
    <section className=" max-w-7xl mx-auto">
      <div>
        <h1 className=" font-extrabold text-[#fbfdf6] text-[32px]">Create</h1>
        <p className=" mt-2 text-[#f5d0cc] text-[16px] max-w[500px]">
          Create Visually Stunning AI Images Generated By GenZAI
        </p>
      </div>
      <form className=" max-w-3xl mt-16" onSubmit={handlesubmit}>
        <div className=" flex flex-col gap-5">
          <Formfeild
            LabelName="your name"
            name="name"
            type="text"
            placeholder="Enter Your Name"
            handleChange={handleChange}
            value={Form.name}
          />
          <Formfeild
            LabelName="Prompt"
            name="prompt"
            type="text"
            placeholder="A comic book cover of a superhero wearing headphones"
            handleChange={handleChange}
            value={Form.prompt}
            IsSupriseME
            handleIsSupriseME={handleIsSupriseME}
          />
        </div>
        <div className=" mt-5 relative bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 w-64 h-64 p-3 flex justify-center items-center">
          {Form.picture ? (
            <img
              className=" w-full object-contain h-full"
              src={Form.picture}
              alt={Form.prompt}
            />
          ) : (
            <img
              className=" w-9/12 h-9/12 object-contain opacity-40"
              src={preview}
              alt="preview"
            />
          )}
          {GeneratingImg && (
            <div className=" absolute z-0 inset-0 flex justify-center items-center bg-[rgba(0,0,0,0.5)] rounded-lg">
              <Loader />
            </div>
          )}
        </div>
        <div className=" mt-5 gap-5 flex">
          <button
            className=" text-white bg-blue-500 font-medium rounded-md text-sm w-full sm:w-auto px-5 py-2.5"
            type="button"
            onClick={GenerateIMG}
          >
            {GeneratingImg ? "Generating..." : "Generate"}
          </button>
        </div>
        <div className=" mt-10">
          <p className=" text-[#f5d0cc] text-[14px] mt-2">
            Once Created Your Amazing Design, You Can Share It With Our
            Community For Free
          </p>
          <button
            type="submit"
            className="font-medium rounded-md text-sm w-full sm:w-auto px-5 py-2.5 mt-3 text-white bg-[#6469ff]"
          >
            {loading ? "Sharing..." : "Share It With Community"}
          </button>
        </div>
      </form>
    </section>
  );
};

export default CreatePost;
