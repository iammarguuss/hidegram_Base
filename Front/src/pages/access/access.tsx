import { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";

import ContentWrapper from "@/components/contentWrapper";
import EditBtn from "@/components/editBtn";
import Header from "@/components/header";
import Menu from "@/components/menu/menu";
import Scrollable from "@/components/scrollable";
import SidebarWrapper from "@/components/sidebarWrapper";
import Switcher from "@/components/ui/switcher";
import Button from "@/components/ui/button";

function Access() {
  const navigate = useNavigate();
  const [isEdit, setIsEdit] = useState(false);

  useEffect(() => {
    navigate("/access/signup");
  }, [navigate]);

  return (
    <>
      <SidebarWrapper>
        <Header>
          <EditBtn className="text-left" onClick={() => setIsEdit((s) => !s)}>
            {isEdit ? "Cancel" : "Edit"}
          </EditBtn>
          <span className="text-lg font-semibold">Access</span>
          <div className="w-[55px]">
            <img
              src="/icon-plus.svg"
              alt="plus icon"
              className="ml-auto cursor-pointer"
            />
          </div>
        </Header>

        <Scrollable className="h-[calc(100%-124px)] md:h-[calc(100%-110px)] md:px-4">
          <div className="w-full max-w-2xl mx-auto">
            <div className="px-4 text-sm text-gray mb-[6px]">
              SHOW PASSWORDS IN CHATS
            </div>
            <Switcher
              label="Load All Chats"
              classNameLabel="md:rounded-[10px] mb-[9px]"
            />
          </div>

          <div className="bg-darkGray md:rounded-[10px]">
            {/* TODO Access */}
            {/* {myData.map((data) => {
							return (
								<AccessItem
									key={data.id}
									isEdit={isEdit}
									id={data.id}
									title={data.title}
								/>
							);
						})} */}
          </div>
        </Scrollable>

        {!isEdit && <Menu />}
        {isEdit && (
          <Button className="h-[70px] md:h-[50px] md:rounded-none text-lg md:text-center">
            Delete
          </Button>
        )}
      </SidebarWrapper>

      <ContentWrapper>
        <Outlet />
      </ContentWrapper>
    </>
  );
}

export default Access;
